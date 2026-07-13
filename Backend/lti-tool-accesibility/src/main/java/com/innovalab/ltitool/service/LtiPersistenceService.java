package com.innovalab.ltitool.service;

import com.google.cloud.firestore.Firestore;
import com.innovalab.ltitool.dto.LtiLaunchDTO;
import com.innovalab.ltitool.dto.UserPreferencesDTO;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class LtiPersistenceService {

    private final Firestore db;

    // Spring Boot inyecta automáticamente el Bean 'firestore' configurado previamente
    public LtiPersistenceService(Firestore db) {
        this.db = db;
    }

    /**
     * Guarda el historial de accesos (Launches) provenientes de Moodle
     */
    public void saveLaunch(LtiLaunchDTO dto) {
        try {
            this.db.collection("lti_launches")
                    .document(dto.getIdLaunch())
                    .set(dto);

            System.out.println("Petición LTI guardada con éxito. ID: " + dto.getIdLaunch());
        } catch (Exception e) {
            System.err.println("Error al persistir el acceso LTI en Firebase: " + e.getMessage());
        }
    }

    @Async // para que no espere la respuesta quien lo invoque
    public void saveUserPreferences(UserPreferencesDTO dto) {
        try {
            dto.setLastUpdated(Instant.now());

            // Lo guarda como un documento nuevo en tu historial
            this.db.collection("accessibility_events").add(dto);

            System.out.println("Evento registrado para: " + dto.getUserId());
        } catch (Exception e) {
            System.err.println("Error al guardar evento: " + e.getMessage());
        }
    }
    }