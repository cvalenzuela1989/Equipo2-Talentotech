package com.innovalab.ltitool.controller;

import com.innovalab.ltitool.dto.UserPreferencesDTO;
import com.innovalab.ltitool.service.LtiPersistenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*") // Permite la comunicación con el puerto de React en desarrollo
public class UserPreferencesController {

    private final LtiPersistenceService ltiPersistenceService;

    public UserPreferencesController(LtiPersistenceService ltiPersistenceService) {
        this.ltiPersistenceService = ltiPersistenceService;
    }

    /**
     * Recibe el evento de accesibilidad desde React y responde HTTP 200 al instante,
     * delegando el guardado físico en Firebase a un hilo secundario asíncrono.
     */
    @PostMapping("/events/accessibility")
    public ResponseEntity<String> updateAccessibility(@RequestBody UserPreferencesDTO dto) {
        this.ltiPersistenceService.saveUserPreferences(dto);
        return ResponseEntity.ok("Evento de accesibilidad recibido");
    }
}

