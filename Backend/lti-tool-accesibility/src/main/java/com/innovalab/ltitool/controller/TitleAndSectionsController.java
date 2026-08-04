package com.innovalab.ltitool.controller;

import com.innovalab.ltitool.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/titleAndSections")
@CrossOrigin(origins = "${app.react-url}")
public class TitleAndSectionsController {

    private final AiService aiService;

    public TitleAndSectionsController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping
    public ResponseEntity<String> generateTitleAndSections(@RequestBody String text) {

        String generatedTitleAndSections = aiService.generateTitleAndSections(text);
        return ResponseEntity.ok(generatedTitleAndSections);
    }
}
