package com.innovalab.ltitool.controller;

import com.innovalab.ltitool.service.MoodleClient;
import com.innovalab.ltitool.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
public class PdfController {

    private final PdfService pdfService;

    public PdfController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> getPdf(
            @RequestParam String fileUrl) {


        // 3. descargar PDF directamente
        byte[] pdfBytes = pdfService.downloadPdf(fileUrl);

        // 4. devolver al frontend
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=archivo.pdf")
                .body(pdfBytes);
    }
}