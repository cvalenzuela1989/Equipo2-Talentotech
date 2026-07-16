package com.innovalab.ltitool.util;

import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.innovalab.ltitool.dto.LtiLaunchDTO;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public class LtiMapper {

    public static LtiLaunchDTO fromJWT(DecodedJWT jwt) {

        LtiLaunchDTO dto = new LtiLaunchDTO();

        // 1. Identificador único del lanzamiento
        String uniqueId = jwt.getId() != null ? jwt.getId() : UUID.randomUUID().toString();
        dto.setIdLaunch(uniqueId);

        // 2. Datos básicos del usuario
        dto.setUserId(jwt.getSubject());
        dto.setEmail(jwt.getClaim("email").asString());
        dto.setName(jwt.getClaim("name").asString());

        // 3.Guardar el momento exacto del lanzamiento
        Instant launchTime = jwt.getIssuedAtAsInstant();
        dto.setLaunchTime(launchTime);

        // 4. Mapeo seguro del Contexto (Curso)
        Claim contextClaim = jwt.getClaim("https://purl.imsglobal.org/spec/lti/claim/context");
        if (!contextClaim.isNull()) {
            Map<String, Object> context = contextClaim.asMap();
            dto.setCourseId((String) context.get("id"));
            dto.setCourseTitle((String) context.get("title"));
        }

        // 5. Mapeo seguro del Resource Link (Actividad/Módulo)
        Claim resourceClaim = jwt.getClaim("https://purl.imsglobal.org/spec/lti/claim/resource_link");
        if (!resourceClaim.isNull()) {
            Map<String, Object> resource = resourceClaim.asMap();

            Object resourceId = resource.get("id");
            if (resourceId != null) {
                dto.setResourceLinkId(resourceId.toString());
                dto.setModuleId(resourceId.toString());
            }

            dto.setModuleTitle((String) resource.get("title"));
        }

        dto.setStatus("OK");
        dto.setMessage("LTI launch successful");

        return dto;
    }
}