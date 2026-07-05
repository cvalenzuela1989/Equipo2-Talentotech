package com.innovalab.ltitool.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.innovalab.ltitool.dto.LtiLaunchDTO;
import com.innovalab.ltitool.util.LtiMapper;
import com.innovalab.ltitool.service.MoodleContentResolver;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;


@RestController
@RequestMapping("/lti")
public class LtiController {

    private final MoodleContentResolver moodleContentResolver;

    @Value("${moodle.auth-url}")
    private String authUrl;


    public LtiController(
            MoodleContentResolver moodleContentResolver
    ){
        this.moodleContentResolver = moodleContentResolver;
    }
    // =====================================================
    // OIDC LOGIN
    // =====================================================
    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestParam Map<String,String> params){

        System.out.println("\n========== LTI LOGIN ==========");
        params.forEach((k,v) -> System.out.println(k+" = "+v) );

        String state = params.get("state");
        String nonce = params.get("nonce");

        if(state == null)
            state = UUID.randomUUID().toString();

        if(nonce == null)
            nonce = UUID.randomUUID().toString();

        String redirect = authUrl +"?"
                        + "scope=openid"
                        + "&response_type=id_token"
                        + "&response_mode=form_post"
                        + "&client_id="
                        + params.get("client_id")
                        + "&redirect_uri="
                        + URLEncoder.encode(
                        params.get("target_link_uri"),
                        StandardCharsets.UTF_8
                )
                        + "&login_hint="
                        + params.get("login_hint")
                        + "&lti_message_hint="
                        + URLEncoder.encode(
                        params.get("lti_message_hint"),
                        StandardCharsets.UTF_8
                )

                        + "&state="
                        + state
                        + "&nonce="
                        + nonce;

        System.out.println("\n========== REDIRECT FINAL ==========");
        System.out.println(redirect);

        return ResponseEntity
                .status(302)
                .header("Location", redirect)
                .build();
    }

    // =====================================================
    // LTI LAUNCH
    // Estudiante o Deep Linking
    // =====================================================
    @PostMapping("/launch")
    public ResponseEntity<?> launch(@RequestParam Map<String,String> params ){

        System.out.println("\n========== LTI LAUNCH ==========");
        String idToken = params.get("id_token");

        if(idToken == null){
            return ResponseEntity
                    .badRequest()
                    .body("Missing id_token");
        }

        DecodedJWT jwt =  JWT.decode(idToken);

        String messageType = jwt.getClaim("https://purl.imsglobal.org/spec/lti/claim/message_type"                      )
                        .asString();

        System.out.println("MESSAGE TYPE = " + messageType);
        /*
         * Profesor insertando contenido
         */
        if("LtiDeepLinkingRequest".equals(messageType)){
            System.out.println(
                    "========== DEEP LINKING MODE =========="
            );
            return ResponseEntity.ok(
                    buildDeepLinkPage()
            );
        }

        /*
         * Alumno entrando a la herramienta
         */
        System.out.println(
                "========== RESOURCE LINK MODE =========="
        );

        LtiLaunchDTO dto = LtiMapper.fromJWT(jwt);
        moodleContentResolver.resolveSectionId(dto);
        System.out.println(dto);

        //return ResponseEntity.ok(buildStudentPagePDF(dto));
        return ResponseEntity.ok(buildStudentPage(dto));

    }

    private String buildStudentPagePDF(LtiLaunchDTO dto) {

        String html = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>LTI Tool</title>
    </head>

    <body>

    <header>📘 LTI Accessibility Tool</header>

    <div class="container">

        <h3>Curso: {COURSE}</h3>
        <h4>Seccion: {SECTION_TITLE}</h4>

    </div>

    <script>

        // =========================
        // CONTEXTO LTI (CLAVE)
        // =========================
        const LTI = {
            courseId: "{COURSE_ID}",
            sectionId: "{SECTION_ID}",
            moduleId: "{MODULE_ID}",
            pdfUrl: "{PDF_URL}"
        };

        // =========================
        // PDF DIRECTO
        // =========================
        async function loadPdf() {

            const url = "/api/v1/view?fileUrl=" + LTI.pdfUrl;

            const res = await fetch(url);

            const blob = await res.blob();

            const pdfUrl = URL.createObjectURL(blob);

            document.getElementById("pdfFrame").src = pdfUrl;
        }

        window.onload = loadPdf;

    </script>

    <iframe id="pdfFrame"
            style="width:100%;height:600px"></iframe>

    </body>
    </html>
    """;

        return html
                .replace("{COURSE}", safe(dto.getCourseTitle()))
                .replace("{MODULE}", safe(dto.getModuleTitle()))
                .replace("{COURSE_ID}", String.valueOf(dto.getCourseId()))
                .replace("{SECTION_ID}", String.valueOf(dto.getSectionId()))
                .replace("{SECTION_TITLE}", String.valueOf(dto.getSectionTitle()))
                .replace("{MODULE_ID}", String.valueOf(dto.getModuleId()))
                .replace("{PDF_URL}", String.valueOf(dto.getPdfUrl()));
    }




    // =====================================================
    // PANTALLA PROFESOR
    // =====================================================
    private String buildDeepLinkPage(){


        return """
        <!DOCTYPE html>

        <html>

        <body>


        <h2>
        🤖 Asistente de Accesibilidad IA
        </h2>


        <p>
        Insertar herramienta en este curso
        </p>


        <button>
        Agregar asistente
        </button>


        </body>

        </html>
        """;

    }







    private String buildStudentPage(LtiLaunchDTO dto) {

        String html = """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                <meta charset="UTF-8">
                <title>LTI Accessibility MVP</title>

                <style>
                body{margin:0;font-family:Arial;background:#f4f6f9}
                header{background:#2c3e50;color:white;padding:16px}
                .container{padding:20px}
                .card{background:white;padding:16px;margin-bottom:15px;border-radius:10px}
                .grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}
                button{padding:10px;margin:5px;border:0;border-radius:6px;cursor:pointer}
                .blue{background:#3498db;color:white}
                .green{background:#2ecc71;color:white}
                .orange{background:#f39c12;color:white}
                .progress{height:10px;background:#eee}
                .progress-bar{width:40%;height:100%;background:#2ecc71}
                </style>

                </head>
                <body>

                <header>📘 LTI Accessibility Tool - MVP</header>

                <div class="container">

                <div class="card">
                <h3>👤 Usuario</h3>
                <b>{NAME}</b>
                <p>{EMAIL}</p>
                </div>

                <div class="grid">
                <div class="card">
                <h3>📚 Curso</h3>
                <p>{COURSE}</p>
                </div>

                <div class="card">
                    <h3>📖 Sección</h3>
                    <p>{SECTION_TITLE}</p>
                </div>
                </div>

                <div class="card">
                    <h3>⚙️ Accesibilidad</h3>
                    
                    <button class="blue" onclick="setMode('normal')">Normal</button>
                    <button class="green" onclick="setMode('dyslexia')">Dislexia</button>
                    <button class="orange" onclick="setMode('high-contrast')">Contraste</button>
                    
                    <p id="mode">Modo actual: normal</p>
                </div>
                                
                <div class="card">
                    <h3>📄 Material</h3>
                               
                    <button class="blue" onclick="openPdf()">Abrir PDF</button>
                </div>

                <div class="card">
                <h3>🎧 Texto a voz</h3>
                <button class="blue" onclick="speak()">Leer contenido</button>
                </div>

                <div class="card">
                <h3>🤖 IA - Resumen</h3>

                <button class="blue" onclick="generateSummary()">
                Generar resumen
                </button>

                <p id="summary"></p>
                </div>

                <div class="card">
                <h3>📊 Progreso</h3>
                <div class="progress">
                <div class="progress-bar"></div>
                </div>
                </div>

                </div>

                <script>
                function openPdf(){
                    const url = "/api/v1/view?fileUrl=" + encodeURIComponent("{PDF_URL}");
                    window.open(url, "_blank");
                }
                                
                function setMode(m){
                    document.getElementById("mode").innerText="Modo actual: "+m;
                }

                function speak(){

                    const text =
                    document.getElementById("summary").innerText ||
                    "{MODULE}";

                    if(!text)return;

                    const speech=new SpeechSynthesisUtterance(text);

                    speech.lang="es-AR";
                    speech.rate=1;
                    speech.pitch=1;

                    speechSynthesis.cancel();
                    speechSynthesis.speak(speech);
                }


                async function generateSummary(){

                    const res=await fetch(
                    "/api/v1/summarize?pdfUrl="+encodeURIComponent("{PDF_URL}"),
                    {method:"POST"});

                    document.getElementById("summary").innerText=
                    await res.text();
                }

                </script>

                </body>
                </html>
                """;


        return html
                .replace("{NAME}", safe(dto.getName()))
                .replace("{EMAIL}", safe(dto.getEmail()))
                .replace("{COURSE}", safe(dto.getCourseTitle()))
                .replace("{MODULE}", safe(dto.getModuleTitle()))
                .replace("{SECTION_ID}", safe(dto.getSectionId()))
                .replace("{SECTION_TITLE}", safe(dto.getSectionTitle()))
                .replace("{PDF_URL}", safe(dto.getPdfUrl()));
    }


    private String safe(String value){

        if(value == null){
            return "";
        }


        return value
                .replace("&","&amp;")
                .replace("<","&lt;")
                .replace(">","&gt;")
                .replace("\"","&quot;");

    }

}