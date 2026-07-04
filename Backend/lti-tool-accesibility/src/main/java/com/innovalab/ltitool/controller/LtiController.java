package com.innovalab.ltitool.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.innovalab.ltitool.dto.LtiLaunchDTO;
import com.innovalab.ltitool.util.LtiMapper;
import com.innovalab.ltitool.service.MoodleContentResolver;

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

        String redirect =

                "http://localhost/mod/lti/auth.php?"
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

        return ResponseEntity.ok(buildStudentPagePDF(dto));

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

            const url = "/api/pdf?fileUrl=" + LTI.pdfUrl;

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
            
            body {
                margin:0;
                font-family:Arial,sans-serif;
                background:#f4f6f9;
            }
            
            header {
                background:#2c3e50;
                color:white;
                padding:16px;
                font-size:18px;
            }
            
            .container {
                padding:20px;
            }
            
            .card {
                background:white;
                padding:16px;
                margin-bottom:15px;
                border-radius:10px;
                box-shadow:0 2px 6px rgba(0,0,0,0.1);
            }
            
            .grid {
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:15px;
            }
            
            button {
                padding:10px 12px;
                margin:5px;
                border:none;
                border-radius:6px;
                cursor:pointer;
            }
            
            .blue {
                background:#3498db;
                color:white;
            }
            
            .green {
                background:#2ecc71;
                color:white;
            }
            
            .orange {
                background:#f39c12;
                color:white;
            }
            
            
            .progress {
                height:10px;
                background:#eee;
                border-radius:5px;
                overflow:hidden;
            }
            
            .progress-bar {
                width:40%;
                height:100%;
                background:#2ecc71;
            }
            
            
            </style>
            
            </head>
            
            
            <body>
            
            
            <header>
            📘 LTI Accessibility Tool - MVP
            </header>
            
            
            <div class="container">
            
            
            <div class="card">
            
            <h3>👤 Usuario</h3>
            
            <p>
            <b>{NAME}</b>
            </p>
            
            <p>
            {EMAIL}
            </p>
            
            </div>
            
            
            
            <div class="grid">
            
            
            <div class="card">
            
            <h3>📚 Curso</h3>
            
            <p>
            {COURSE}
            </p>
            
            </div>
            
            
            
            <div class="card">
            
            <h3>📖 Módulo</h3>
            
            <p>
            {MODULE}
            </p>
            
            </div>
            
            
            </div>
            
            
            
            <div class="card">
            
            <h3>⚙️ Accesibilidad</h3>
            
            
            <button class="blue" onclick="setMode('normal')">
            Normal
            </button>
            
            
            <button class="green" onclick="setMode('dyslexia')">
            Dislexia
            </button>
            
            
            <button class="orange" onclick="setMode('high-contrast')">
            Contraste
            </button>
            
            
            <p id="mode">
            Modo actual: normal
            </p>
            
            
            </div>
            
            
            
            
            <div class="card">
            
            <h3>🎧 Texto a voz</h3>
            
            
            <button class="blue" onclick="speak()">
            Leer contenido
            </button>
            
            
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
            
            
            let mode = "normal";
            
            
            function setMode(m){
            
                mode = m;
            
                document.getElementById("mode")
                    .innerText = "Modo actual: " + m;
            
            }
            
            
            
            function speak(){
            
                const text =
                "Estás dentro del módulo de accesibilidad del curso";
            
            
                speechSynthesis.speak(
                    new SpeechSynthesisUtterance(text)
                );
            
            }
            
            
            
            
            async function generateSummary(){
            
            
                const res = await fetch("/api/ai/summary",{
            
                    method:"POST",
            
                    headers:{
                        "Content-Type":"application/json"
                    },
            
            
                    body:JSON.stringify({
            
                        moduleTitle:"{MODULE}"
            
                    })
            
                });
            
            
            
                const data = await res.json();
            
            
                document.getElementById("summary")
                    .innerText=data.summary;
            
            
            }
            
            
            
            </script>
            
            
            </body>
            
            </html>
            """;


        return html
                .replace("{NAME}", safe(dto.getName()))
                .replace("{EMAIL}", safe(dto.getEmail()))
                .replace("{COURSE}", safe(dto.getCourseTitle()))
                .replace("{MODULE}", safe(dto.getModuleTitle()));

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