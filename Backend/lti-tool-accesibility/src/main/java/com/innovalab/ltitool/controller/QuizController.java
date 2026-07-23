package com.innovalab.ltitool.controller;

import com.innovalab.ltitool.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/quiz")
@CrossOrigin(origins = "${app.react-url}")
public class QuizController {

    private final AiService aiService;

    public QuizController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping
    public ResponseEntity<String> generateQuiz(@RequestBody String text) {

        String generatedQuiz = aiService.generateQuizFromText(text);
        return ResponseEntity.ok(generatedQuiz);
    }
}
