package com.innovalab.ltitool.service;

import org.springframework.stereotype.Service;

@Service
public class AiService {

    public String summarize(String text) {

        if(text == null || text.isBlank()){
            return "No hay contenido para resumir";
        }

        return "🧠 RESUMEN:\n\n"
                + text.substring(0, Math.min(500, text.length()))
                + "\n\n... [RESUMIDO PARA MVP]";
    }
}
