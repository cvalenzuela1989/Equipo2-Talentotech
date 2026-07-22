package com.innovalab.ltitool.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.config.file:}") // Valor por defecto vacío
    private String firebaseConfigFile;

    // Esta variable la leeremos desde las Environment Variables de Render
    @Value("${FIREBASE_CONFIG_JSON:#{null}}")
    private String firebaseConfigJson;

    @Bean
    public FirebaseApp firebaseApp() {
        try {
            GoogleCredentials credentials;

            if (firebaseConfigJson != null && !firebaseConfigJson.isEmpty()) {
                // CASO RENDER: Leer desde variable de entorno (texto plano del JSON)
                InputStream inputStream = new ByteArrayInputStream(firebaseConfigJson.getBytes(StandardCharsets.UTF_8));
                credentials = GoogleCredentials.fromStream(inputStream);
            } else if (firebaseConfigFile != null && !firebaseConfigFile.isEmpty()) {
                // CASO LOCAL: Leer desde archivo en carpeta resources
                InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream(firebaseConfigFile);
                if (serviceAccount == null) {
                    throw new IOException("No se encontró el archivo: " + firebaseConfigFile);
                }
                credentials = GoogleCredentials.fromStream(serviceAccount);
            } else {
                throw new IllegalStateException("Debes configurar firebase.config.file (local) o FIREBASE_CONFIG_JSON (servidor).");
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .build();

            return FirebaseApp.getApps().isEmpty() ? FirebaseApp.initializeApp(options) : FirebaseApp.getInstance();
            
        } catch (IOException e) {
            throw new RuntimeException("Error al inicializar Firebase: " + e.getMessage(), e);
        }
    }

    @Bean
    public Firestore firestore(FirebaseApp firebaseApp) {
        return FirestoreClient.getFirestore();
    }
}