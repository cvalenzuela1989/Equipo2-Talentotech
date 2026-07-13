package com.innovalab.ltitool.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.config.file}")
    private String firebaseConfigFile;

    /**
     * Inicializa la aplicación de Firebase de manera segura al arrancar el contexto.
     * Registramos la inicialización dentro de un Bean para asegurar que ocurra ANTES
     * de que otros servicios intenten usar Firestore.
     */
    @Bean
    public FirebaseApp firebaseApp() {
        try {
            if (firebaseConfigFile == null || firebaseConfigFile.trim().isEmpty()) {
                throw new IllegalArgumentException("La propiedad firebase.config.file no está configurada en application.properties.");
            }

            InputStream serviceAccount = getClass()
                    .getClassLoader()
                    .getResourceAsStream(firebaseConfigFile);

            if (serviceAccount == null) {
                throw new IOException("No se pudo encontrar el archivo de Firebase en resources: " + firebaseConfigFile);
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            // Si ya existe una instancia creada (por recargas en caliente o tests), la reutiliza
            if (FirebaseApp.getApps().isEmpty()) {
                return FirebaseApp.initializeApp(options);
            } else {
                return FirebaseApp.getInstance();
            }
        } catch (IOException e) {
            throw new RuntimeException("Error crítico al inicializar Firebase Admin SDK: " + e.getMessage(), e);
        }
    }

    /**
     * Al exponer esto como @Bean, Spring Boot lo detecta y lo inyecta automáticamente
     * en el constructor de tu LtiPersistenceService.
     */
    @Bean
    public Firestore firestore(FirebaseApp firebaseApp) {
        // FirestoreClient necesita que FirebaseApp ya esté inicializado (por eso se lo pasamos por parámetro)
        return FirestoreClient.getFirestore();
    }
}
