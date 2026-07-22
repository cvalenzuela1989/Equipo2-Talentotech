package com.innovalab.ltitool.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    private final ChatClient chatClient;

    public AiService(ChatClient.Builder chatClientBuilder) {
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