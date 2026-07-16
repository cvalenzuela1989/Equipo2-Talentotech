package com.innovalab.ltitool.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.innovalab.ltitool.dto.LtiLaunchDTO;
import com.innovalab.ltitool.service.LtiPersistenceService;
import com.innovalab.ltitool.util.LtiMapper;
import com.innovalab.ltitool.service.MoodleContentResolver;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;


@RestController
@RequestMapping("/lti")
public class LtiController {

    private final MoodleContentResolver moodleContentResolver;
    private final LtiPersistenceService ltiPersistenceService;
    @Value("${moodle.auth-url}")
    private String authUrl;

    @Value("${app.react-url}")
    private String appReactURL;


    public LtiController(MoodleContentResolver moodleContentResolver, LtiPersistenceService ltiPersistenceService)
    {
        this.moodleContentResolver = moodleContentResolver;
        this.ltiPersistenceService = ltiPersistenceService;
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
    // =====================================================
    @PostMapping("/launch")
    public Object launch(@RequestParam Map<String,String> params ) {

        System.out.println("\n========== LTI LAUNCH ==========");
        String idToken = params.get("id_token");

        if (idToken == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Missing id_token");
        }

        DecodedJWT jwt = JWT.decode(idToken);


        LtiLaunchDTO dto = LtiMapper.fromJWT(jwt);
        moodleContentResolver.resolveSectionId(dto);

        ltiPersistenceService.saveLaunch(dto);

        return new RedirectView(buildFrontendRedirectUrl(dto));
    }


    /**
     * Construye de manera descriptiva la URL de redirección hacia el Frontend de React,
     * adjuntando los parámetros de contexto e identificación del usuario necesarios.
     *
     * @param dto Datos del lanzamiento LTI procesados desde Moodle
     * @return String URL completa con Query Params listos para el Frontend
     */
    private String buildFrontendRedirectUrl(LtiLaunchDTO dto) {
        return UriComponentsBuilder.fromUriString(appReactURL)
                .queryParam("userId", dto.getUserId()) // ID unívoco para futuras preferencias
                .queryParam("user", dto.getName())
                .queryParam("email", dto.getEmail())
                .queryParam("course", dto.getCourseTitle())
                .queryParam("section", dto.getSectionTitle())
                .queryParam("pdfUrl", dto.getPdfUrl())
                // .queryParam("role", dto.getRole()) // Descomentar cuando se agregue el rol al DTO
                .build()
                .toUriString();
    }

}