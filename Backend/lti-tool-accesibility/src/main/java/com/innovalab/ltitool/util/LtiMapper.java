package com.innovalab.ltitool.util;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.innovalab.ltitool.dto.LtiLaunchDTO;

import java.util.Map;

public class LtiMapper {

    public static LtiLaunchDTO fromJWT(DecodedJWT jwt) {

        LtiLaunchDTO dto = new LtiLaunchDTO();

        dto.setUserId(jwt.getSubject());
        dto.setEmail(jwt.getClaim("email").asString());
        dto.setName(jwt.getClaim("name").asString());

        Map<String, Object> context =
                jwt.getClaim("https://purl.imsglobal.org/spec/lti/claim/context").asMap();

        Map<String, Object> resource =
                jwt.getClaim("https://purl.imsglobal.org/spec/lti/claim/resource_link").asMap();

        Map<String, Object> resourceLink =
                jwt.getClaim("https://purl.imsglobal.org/spec/lti/claim/resource_link")
                        .asMap();

        Object id = resourceLink.get("id");

        if(id != null){
            dto.setResourceLinkId(id.toString());
        }

        System.out.println(resource);

        if (context != null) {
            dto.setCourseId((String) context.get("id"));
            dto.setCourseTitle((String) context.get("title"));
        }

        if (resource != null) {
            dto.setModuleId((String) resource.get("id"));
            dto.setModuleTitle((String) resource.get("title"));
        }

        // Obtener los parámetros personalizados
        Map<String, Object> customClaims =
                jwt.getClaim("https://purl.imsglobal.org/spec/lti/claim/custom").asMap();



        dto.setStatus("OK");
        dto.setMessage("LTI launch successful");

        return dto;
    }
}