package com.innovalab.ltitool.controller;

import com.innovalab.ltitool.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/flashcards")
@CrossOrigin(origins = "${app.react-url}")
public class FlashcardsController {

    private final AiService aiService;

    public FlashcardsController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping
    public ResponseEntity<String> generateFlashcards(@RequestBody String text) {

        String generatedFlashcards = aiService.generateFlashcards(text);
        return ResponseEntity.ok(generatedFlashcards);
    }
}
