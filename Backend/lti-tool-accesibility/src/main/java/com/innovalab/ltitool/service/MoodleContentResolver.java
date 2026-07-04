package com.innovalab.ltitool.service;

import com.fasterxml.jackson.databind.JsonNode;
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

        String resourceTitle =
                dto.getModuleTitle();

        System.out.println(
                "BUSCANDO TOOL: " + resourceTitle
        );

        for(JsonNode section : sections){

            for(JsonNode module : section.get("modules")){

                String moduleName =
                        module.get("name").asText();


                System.out.println(
                        "Comparando: " + moduleName
                );

                if(moduleName.equals(resourceTitle)){
                    // SECTION
                    dto.setSectionId(
                            section.get("section").asText()
                    );


                    dto.setSectionTitle(
                            section.get("name").asText()
                    );

                    System.out.println(
                            "Section encontrada: "
                                    + dto.getSectionId()
                                    + " - "
                                    + dto.getSectionTitle()
                    );

                    // BUSCAR PDF EN LA MISMA SECTION
                    for(JsonNode sectionModule : section.get("modules")){

                        String modName =
                                sectionModule.get("modname").asText();

                        if("resource".equals(modName)  && sectionModule.has("contents")){
                            for(JsonNode content : sectionModule.get("contents")){
                                String mime = content.get("mimetype").asText();
                                if("application/pdf".equals(mime)){
                                    dto.setPdfName(content.get("filename").asText());
                                    dto.setPdfUrl(content.get("fileurl").asText());
                                    System.out.println("PDF encontrado: "+dto.getPdfName());
                                    return;
                                }
                            }
                        }
                    }
                 return;
                }
            }
        }
        throw new RuntimeException("No se encontró la herramienta" );
    }
}