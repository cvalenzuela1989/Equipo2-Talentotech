package com.innovalab.ltitool.controller;

import com.innovalab.ltitool.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/explanation")
@CrossOrigin(origins = "${app.react-url}")
public class ExplanationController {

    private final AiService aiService;

    public ExplanationController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping
    public ResponseEntity<String> explanationText(@RequestBody String text) {

        String explained = aiService.explainText(text);
        return ResponseEntity.ok(explained);
    }
}