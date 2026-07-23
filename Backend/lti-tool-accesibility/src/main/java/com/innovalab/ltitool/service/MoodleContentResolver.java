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


    /**
     * Este método busca por el idCurso el idSection ( Tema o tópico)
     *   y a partir de ese id busca el pdf ( si hay uno)
     *   Por ws del LMS -> obtiene las sections del curso
     *   Itera cada section hasta que coincida el ResourceLikId (es el id de la tool de accesibilidad)
     *   Cuando esta parado en esa tool obtenemos el 1er pdf que exista
     **/
    public void resolveSectionId(LtiLaunchDTO dto) {

        JsonNode sections = moodleClient.getCourseContents(Long.valueOf(dto.getCourseId()));
        String target = dto.getResourceLinkId(); // 👈 CLAVE REAL

        for (JsonNode section : sections) {
            // Usamos path() en lugar de get() para evitar nulos
            JsonNode modules = section.path("modules");

            for (JsonNode module : modules) {
                String instanceId = module.path("instance").asText("");

                if (instanceId.equals(target)) {
                    // Encontramos la herramienta, guardamos la sección
                    dto.setSectionId(section.path("section").asText(""));
                    dto.setSectionTitle(section.path("name").asText(""));

                    // Buscamos el PDF dentro de los módulos de ESTA misma sección
                    findAndAssignPdf(modules, dto);

                    return; // Terminamos la ejecución exitosamente
                }
            }
        }

        // Si el ciclo termina y no se hizo el "return", lanzamos el error para el GlobalHandler
        throw new RuntimeException("No se encontró la herramienta LTI en el curso de Moodle.");
    }

    /**
     * Searches for and assigns the PDF. If not found, throws an exception
     * to be caught by the GlobalExceptionHandler.
     */
    private void findAndAssignPdf(JsonNode modules, LtiLaunchDTO dto) {
        for (JsonNode module : modules) {
            String modName = module.path("modname").asText("");

            // Verify if it is a resource and has contents
            if ("resource".equals(modName) && module.has("contents")) {
                for (JsonNode content : module.path("contents")) {
                    String mimeType = content.path("mimetype").asText("");

                    // If we find the PDF, assign it and return
                    if ("application/pdf".equals(mimeType)) {
                        dto.setPdfName(content.path("filename").asText(""));
                        dto.setPdfUrl(content.path("fileurl").asText(""));
                        return;
                    }
                }
            }
        }
        // If the loop finishes without returning, no PDF was found.
        // This will trigger your GlobalExceptionHandler.
        throw new RuntimeException("LTI Tool encontrada, pero no hay PDF en esa sección/topico.");
    }

}
