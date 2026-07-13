package com.innovalab.ltitool.service;

import tools.jackson.databind.JsonNode;
import com.innovalab.ltitool.dto.LtiLaunchDTO;
import org.springframework.stereotype.Service;


@Service
public class MoodleContentResolver {


    private final MoodleClient moodleClient;


    public MoodleContentResolver(MoodleClient moodleClient) {
        this.moodleClient = moodleClient;
    }


    public void resolveSectionId(LtiLaunchDTO dto) {

        JsonNode sections =
                moodleClient.getCourseContents(
                        Long.valueOf(dto.getCourseId())
                );

        String target = dto.getResourceLinkId(); // 👈 CLAVE REAL

        for(JsonNode section : sections){

            for(JsonNode module : section.get("modules")){

                String instanceId = module.get("instance").asText();

                if(instanceId.equals(target)){

                    dto.setSectionId(section.get("section").asText());
                    dto.setSectionTitle(section.get("name").asText());

                    for(JsonNode sectionModule : section.get("modules")){

                        if("resource".equals(sectionModule.get("modname").asText())
                                && sectionModule.has("contents")){

                            for(JsonNode content : sectionModule.get("contents")){

                                if("application/pdf".equals(content.get("mimetype").asText())){

                                    dto.setPdfName(content.get("filename").asText());
                                    dto.setPdfUrl(content.get("fileurl").asText());
                                    return;
                                }
                            }
                        }
                    }
                   return;
                }
            }
        }

        throw new RuntimeException("No se encontró la herramienta");
    }
}