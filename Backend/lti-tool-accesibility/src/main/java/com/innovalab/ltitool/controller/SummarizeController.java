package com.innovalab.ltitool.controller;

import com.innovalab.ltitool.service.SummarizeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/summarize")
public class SummarizeController {

    private final SummarizeService summarizeService;

    public SummarizeController(SummarizeService summarizeService) {
        this.summarizeService = summarizeService;
    }


    // Recibe PDF, extrae texto, llama IA y devuelve resumen
    @PostMapping
    public ResponseEntity<String> summarize(@RequestParam("pdfUrl") String pdfUrl) {

        String summary = summarizeService.summarizePdf(pdfUrl);

        return ResponseEntity.ok(summary);
    }
}
