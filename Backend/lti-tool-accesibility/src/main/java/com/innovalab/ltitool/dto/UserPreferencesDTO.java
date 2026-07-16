package com.innovalab.ltitool.dto;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class UserPreferencesDTO {

    private String userId;
    private Map<String, String> tools;
    private Instant lastUpdated;

    // Constructor vacío obligatorio para la deserialización y Firestore
    public UserPreferencesDTO() {
        this.tools = new HashMap<>();
    }

    // Constructor completo de conveniencia
    public UserPreferencesDTO(String userId, Map<String, String> tools, Instant lastUpdated) {
        this.userId = userId;
        this.tools = tools != null ? tools : new HashMap<>();
        this.lastUpdated = lastUpdated;
    }

    // Getters y Setters estándar
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Map<String, String> getTools() {
        return tools;
    }

    public void setTools(Map<String, String> tools) {
        this.tools = tools;
    }

    public Instant getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Instant lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
