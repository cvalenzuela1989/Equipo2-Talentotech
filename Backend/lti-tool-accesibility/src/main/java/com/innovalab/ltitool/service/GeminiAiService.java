package com.innovalab.ltitool.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Primary
@Profile("!local-fake")
public class GeminiAiService implements AiService{

    private final ChatClient chatClient;

    public GeminiAiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String generateQuizFromText(String text) {
        String query = "Analiza el texto y devuelve un JSON que contenga un arreglo llamado 'quiz'. \n" +
                "Cada ítem debe tener exactamente las propiedades: 'pregunta', 'opciones' (un arreglo de 4 strings) y \n" +
                " 'respuestaCorrecta'. Debe tener exactamente 10 preguntas. No agregues texto adicional ni marcas de Markdown. Texto: ";

        return executeAiCall(query + text);
    }

    public String summarizeText(String text) {
        String query = "Actúa como un Rol experto editor, no quiero tu respuesta tenga asteriscos. " +
                "Resume el siguiente texto: ";

        return executeAiCall(query + text);
    }

    public String explainText(String text) {
        String query = "Actúa como un Rol experto profesor. Estudia el siguiente texto académico y explicamelo con otras " +
                "palabras porque no lo entiendo, no quiero tu respuesta tenga asteriscos y no hagas preguntas al final. Texto: ";

        return executeAiCall(query + text);
    }

    public String generateFlashcards(String text) {
        String query = "Actúa como un profesor experto en educación universitaria.\n" +
                "        Tu tarea es analizar el siguiente texto académico y extraer los conceptos clave para crear flashcards (tarjetas de memoria).\n" +
                "\n" +
                "        CONTEXTO DEL USUARIO:\n" +
                "        Tus alumnos necesitan repasar y memorizar mediante el método de \"recuperación activa\" (Active Recall). Por lo tanto, las tarjetas deben ser simples, directas y enfocadas en un solo concepto.\n" +
                "\n" +
                "        REGLAS ESTRICTAS:\n" +
                "        1. Extrae un máximo de 8 conceptos fundamentales del texto.\n" +
                "        2. Cada concepto debe tener el siguiente formato estricto de JSON (para que mi programa lo procese fácilmente):\n" +
                "[\n" +
                "        {\n" +
                "            \"frente\": \"Pregunta clara, definición incompleta o palabra clave.\",\n" +
                "                \"reverso\": \"Respuesta exacta, breve y precisa basada únicamente en el texto.\"\n" +
                "        }\n" +
                "]\n" +
                "        3. NO inventes información, no agregues introducciones, saludos ni explicaciones. Devuelve SOLAMENTE el formato JSON solicitado.\n" +
                "\n" +
                "        TEXTO A ANALIZAR: ";

        return executeAiCall(query + text);
    }

    public String generateTitleAndSections(String text) {
        String query = "Actúa como un profesor experto en educación universitaria. Tu tarea es analizar el siguiente texto académico\n" +
                "        y organizar el siguiente texto plano asignándole un título principal, un subtítulo y divídelo en secciones\n" +
                "       lógicas agregando un título a cada sección. RESPETA EL TEXTO ORIGINAL EXACTAMENTE SIN ALTERAR NI CAMBIAR UNA\n" +
                "        SOLA PALABRA: REGLAS ESTRICTAS:\n" +
                "        1. Crea la cantidad de secciones que creas apropiadas.\n" +
                "        2. Tu respuesta debe tener el siguiente formato estricto de JSON (para que mi programa lo procese fácilmente):\n" +
                "        {\n" +
                "        \"titulo\": \"Título que represente al texto.\",\n" +
                "        \"subtitulo\": \"Subtítulo que represente al texto.\",\n" +
                "        \"secciones\": [\n" +
                "                         {\n" +
                "                          \"titulo_seccion\": \"Título que represente a la sección.\",\n" +
                "                          \"contenido\": \"Aquí va la parte del texto que decidiste ubicar aquí.\"\n" +
                "                         }\n" +
                "                       ]\n" +
                "        }\n" +
                "        3. RESPETA EL TEXTO ORIGINAL EXACTAMENTE SIN ALTERAR NI CAMBIAR UNA SOLA PALABRA\n" +
                "        4. NO inventes información, no agregues introducciones, saludos ni explicaciones. Devuelve SOLAMENTE el formato JSON solicitado.\n" +
                "        TEXTO A ANALIZAR: ";
        return executeAiCall(query + text);
    }

    // Centralized private method with error handling
    private String executeAiCall(String prompt) {
        try {
            return chatClient.prompt(prompt).call().content();
        } catch (Exception e) {
            // Throw a RuntimeException to be caught by the Global Exception Handler
            throw new RuntimeException("Error de comunicación con la IA en el AiService: " + e.getMessage(), e);
        }
    }
}
