package com.innovalab.ltitool.controller;

import com.innovalab.ltitool.service.MoodleClient;
import com.innovalab.ltitool.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "${app.react-url}")
public class PdfController {

    private final PdfService pdfService;

    public PdfController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    @GetMapping("/view")
    public ResponseEntity<byte[]> getPdf(@RequestParam String fileUrl) {
        System.out.println("====== SOLICITUD DE PDF ======");
        System.out.println(fileUrl);

        byte[] pdfBytes = pdfService.downloadPdf(fileUrl);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,    
                        "inline; filename=archivo.pdf")
                .body(pdfBytes);
    }


}