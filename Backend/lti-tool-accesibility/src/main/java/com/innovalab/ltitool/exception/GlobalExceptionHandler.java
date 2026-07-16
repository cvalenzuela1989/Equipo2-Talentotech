package com.innovalab.ltitool.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // =====================================================
    // 404 — Not Found
    // =====================================================
    @ExceptionHandler(NoHandlerFoundException.class)
    public Object handleNotFound(NoHandlerFoundException ex, HttpServletRequest request) {
        log.warn("Ruta no encontrada: {} {}", request.getMethod(), request.getRequestURI());

        // 1. Definimos los datos del error UNA SOLA VEZ
        Map<String, Object> errorData = createErrorData(
                404,
                "Página no encontrada",
                "No handler found for " + request.getMethod() + " " + request.getRequestURI()
        );

        if (isApiRequest(request)) {
            return ResponseEntity.status(404).body(errorData);
        }

        return createErrorModelAndView(errorData);
    }

    // =====================================================
    // 500 — Internal Server Error
    // =====================================================
    @ExceptionHandler(Exception.class)
    public Object handleAllExceptions(Exception ex, HttpServletRequest request) {
        log.error("Error interno detectado en [{} {}]: ", request.getMethod(), request.getRequestURI(), ex);

        String message = ex.getMessage() != null ? ex.getMessage() : "Algo salió mal de nuestro lado. Estamos trabajando para solucionarlo.";

        // 1. Definimos los datos del error UNA SOLA VEZ
        Map<String, Object> errorData = createErrorData(
                500,
                "Error Interno del Servidor",
                message
        );

        // 2. Decidimos el envoltorio según el cliente
        if (isApiRequest(request)) {
            return ResponseEntity.status(500).body(errorData);
        }

        return createErrorModelAndView(errorData);
    }

    // ============
    // Helpers
    // ============
    /**
     * Centraliza la creación del mapa de datos del error.
     */
    private Map<String, Object> createErrorData(int status, String titleOrError, String message) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("status", status);
        data.put("error", titleOrError); // En JSON saldrá como "error", en HTML se puede usar como título
        data.put("message", message);
        return data;
    }

    /**
     * Toma el mapa unificado y lo inyecta masivamente en la vista HTML.
     */
    private ModelAndView createErrorModelAndView(Map<String, Object> errorData) {
        ModelAndView mav = new ModelAndView("error");
        mav.addAllObjects(errorData); // Agrega automáticamente status, error y message al HTML
        return mav;
    }

    private boolean isApiRequest(HttpServletRequest request) {
        String accept = request.getHeader("Accept");
        String uri = request.getRequestURI();

        boolean acceptsJson = accept != null && (accept.contains("application/json") || accept.contains("application/*"));
        boolean isApiPath = uri != null && uri.startsWith("/api");

        return acceptsJson || isApiPath;
    }
}
