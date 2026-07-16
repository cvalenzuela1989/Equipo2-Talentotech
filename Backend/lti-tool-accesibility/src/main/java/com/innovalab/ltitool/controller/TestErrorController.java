package com.innovalab.ltitool.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestErrorController {

    @GetMapping("/provocar-error")
    public String simularError() {
        // Provocamos un error de ejecución clásico
        throw new RuntimeException("Este es un error provocado para probar la página global.");
    }

    @GetMapping("/provocar-npe")
    public String simularNullPointer() {
        // O un NullPointerException, que también caerá en Exception.class
        String texto = null;
        texto.length();
        return "index";
    }
}
