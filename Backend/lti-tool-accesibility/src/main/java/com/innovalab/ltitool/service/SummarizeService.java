package com.innovalab.ltitool.service;

import org.springframework.stereotype.Service;

@Service
public class SummarizeService {

    private final PdfService pdfService;
    private final AiService ai;

    public SummarizeService(PdfService pdfService,AiService ai){
        this.pdfService=pdfService;
        this.ai=ai;
    }

    public String summarizePdf(String url){

        byte[] pdf=pdfService.downloadPdf(url);

        String text=pdfService.extractText(pdf);

        return ai.summarize(text);
    }
}
