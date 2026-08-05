package com.innovalab.ltitool.service;

public interface AiService {
    String generateQuizFromText(String text);
    String summarizeText(String text);
    String explainText(String text);
    String generateFlashcards(String text);
    String generateTitleAndSections(String text);
}