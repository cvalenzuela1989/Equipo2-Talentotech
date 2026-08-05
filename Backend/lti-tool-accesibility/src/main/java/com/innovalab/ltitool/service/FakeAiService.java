package com.innovalab.ltitool.service;

import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Service
@Profile("local-fake") // Se activa solo cuando el perfil sea local-fake
public class FakeAiService implements AiService {

    @Override
    public String generateQuizFromText(String text) {
        return readFile("quiz_response.json");
    }

    @Override
    public String summarizeText(String text) {
        return readFile("summary_response.txt");
    }

    @Override
    public String explainText(String text) {
        return readFile("explain_response.txt");
    }

    @Override
    public String generateFlashcards(String text) {
        return readFile("flashcards_response.json");
    }

    @Override
    public String generateTitleAndSections(String text) {
        return readFile("sections_response.json");
    }

    private String readFile(String fileName) {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("ia_responses/" + fileName)) {
            if (inputStream == null) {
                return "{\"error\": \"Archivo de simulación no encontrado: " + fileName + "\"}";
            }
            return StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Error leyendo el archivo IA simulado: " + fileName, e);
        }
    }
}