# Equipo2-InnovaLab

**NEXA TOOL** es una herramienta LTI (Learning Tools Interoperability) que se integra directamente en Moodle y transforma cualquier material de estudio en una experiencia accesible: ajusta el contenido a la forma en que cada estudiante aprende mejor, en lugar de pedirle al estudiante que se adapte al contenido.

---

##  Funciones actuales

### Lectura y visualización adaptada
- **Visor de PDF integrado**, con panel de herramientas de accesibilidad embebido directamente en el material del curso.
- **Ajuste de tamaño de letra** en tiempo real, sin alterar el archivo original.
- **Cambio de tipografía**, incluyendo fuentes pensadas para facilitar la lectura (dislexia, baja visión).
- **Paleta y color de fondo configurables** (alto contraste y combinaciones de bajo estímulo visual).
- **Modo de lectura concentrada**, que resalta y reorganiza el texto para reducir la carga cognitiva.
- **Herramienta de voz (texto a voz)**, que lee el contenido en voz alta para usuarios con dificultades de lectura.

### Contenido potenciado con Inteligencia Artificial
- **Resumen automático de textos**, para reducir la extensión de materiales extensos a sus ideas clave.
- **Explicación de contenido en lenguaje simple**, que reformula pasajes complejos.
- **Generación automática de cuestionarios (quiz)** a partir del material, para autoevaluación.
- **Flashcards dinámicas**, generadas para reforzar conceptos clave del curso.

---

##  Stack Tecnológico

**Backend**

![Java](https://img.shields.io/badge/Java-437291?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)

**Frontend**

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

**Integración (LMS)**

![Moodle](https://img.shields.io/badge/Moodle-F98012?style=for-the-badge&logo=moodle&logoColor=white)

**Despliegue y Automatización (CI/CD)**

![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Azure](https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)
---


## Escalabiidad y funciones futuras

| Fase | Enfoque Principal | Hito Clave |
|---|---|---|
| **Fase 1** (Corto Plazo) | Data Science & UX — Optimización y tiempo de respuesta | Telemetría de uso y UI adaptativa basada en patrones de lectura |
| **Fase 2** (Mediano Plazo) | Dashboard B2B Institucional | Métricas de inclusión e integración LTI a Canvas y Blackboard |
| **Fase 3** (Largo Plazo) | Motor Predictivo de Aprendizaje | IA con repetición espaciada y certificación de accesibilidad universal |

---


##  Estructura del repositorio

```
Equipo2-Talentotech/
├── Backend/
│   ├── lti-tool-accesibility/   # API Spring Boot (LTI, IA, Firebase, PDF)
│   └── Moodle-sandbox/          # Entorno Moodle + MariaDB vía Docker
├── Frontend/
│   └── mi-app/                  # Aplicación React (Vite)
├── Data/                        # Recursos y datasets
├── Docs/                        # Documentación técnica y funcional
├── QA/                          # Casos de prueba y aseguramiento de calidad
├── UX-UI/                       # Diseños, prototipos y assets de interfaz
└── .github/workflows/           # Pipelines de CI/CD (Azure deploy, CodeQL)
```


##  Puesta en marcha
### Frontend
```bash
cd Frontend/mi-app
npm install
npm run dev
```

### Backend


**Variables de entorno usadas por el backend:**

| Variable | Para qué sirve | ¿Obligatoria? |
|---|---|---|
| `GOOGLE_AI_API_KEY` | Clave de la API de Gemini (funciones de IA: resumen, explicación, quiz, flashcards) | Sí |
| `FIREBASE_CONFIG_JSON` | Contenido completo del `.json` de credenciales de Firebase, en texto plano. Pensada para **entornos de servidor/deploy** (ej. Render, Azure), donde no se sube el archivo físico | Sí, en producción (alternativa a `firebase.config.file` en local) |
| `FRONT_URL` | URL donde corre el frontend (usada por el backend para CORS/redirects). Por defecto es `http://localhost:5173` si no se define | No (tiene valor por defecto en local) |

> En **local**, `GOOGLE_AI_API_KEY` y `FIREBASE_CONFIG_JSON` se pueden setear como variables de entorno del sistema, **o** cargarse directamente en `application.properties` como se explica paso a paso más abajo (clave de Gemini pegada en la línea del archivo, y credencial de Firebase como archivo `.json` en `resources/` en vez de variable de entorno).

1. Cloná el repo y entrá a la carpeta del backend:
```bash
   cd Backend/lti-tool-accesibility
```

2. **Configurá la clave de Gemini (IA):**
   - Generá tu clave en [Google AI Studio](https://aistudio.google.com/api-keys).
   - Abrí el archivo `src/main/resources/application.properties`.
   - Buscá la siguiente línea:
```properties
     spring.ai.google.genai.api-key=${GOOGLE_AI_API_KEY}
```
   - Pegá tu clave luego del `=` y guardá el archivo:
```properties
     spring.ai.google.genai.api-key=TU_CLAVE_DE_GEMINI_ACA
```

3. **Configurá la clave de Firebase:**
   - Entrá a la [Consola de Firebase](https://console.firebase.google.com/).
   - Andá a **Ajustes del Proyecto** (ícono de engranaje ⚙️) → **Configuración del proyecto**.
   - Seleccioná la pestaña **Cuentas de servicio**.
   - Hacé clic en **Generar nueva clave privada**.
   - Se descargará un archivo `.json` con un nombre largo (ej: `lti-external-tool-firebase-adminsdk-xxxxxx.json`).
   - Copiá ese archivo dentro de `src/main/resources/` de tu proyecto Spring Boot.
   - En `application.properties`, verificá que el nombre coincida exactamente con el de tu archivo descargado:
```properties
     firebase.config.file=lti-external-tool-firebase-adminsdk-fbsvc-2a5e705315.json
```
     > Si tu archivo se llamó distinto, actualizá esta línea con el nombre real.
     > En despliegues de servidor (Render, Azure, etc.) se usa en cambio la variable de entorno `FIREBASE_CONFIG_JSON`, pegando ahí el contenido completo del `.json` como texto.

4. **Levantá el servidor:**
```bash
   ./mvnw spring-boot:run
```
  

   **Alternativa: ejecución sin IDE (empaquetado + jar)**

   Parado en la raíz del proyecto (`Backend/lti-tool-accesibility`):
```bash
   ./mvnw clean package
```
   > Si tenés Maven instalado globalmente en tu equipo, también podés usar `mvn` en vez de `./mvnw`.

   Una vez generado el `.jar` en la carpeta `target/`, corré:
```bash
   java -jar target/tu-archivo-nombre.jar
```
   > Reemplazá `tu-archivo-nombre.jar` por el nombre real del archivo generado dentro de `target/`.


### Entorno Moodle de prueba (Docker)
```bash
cd Backend/Moodle-sandbox
docker compose up -d
```

### Configuración de Moodle (herramienta externa LTI)

Una vez que tenés el Moodle levantado (local o en `innovalab.moodlecloud.com`), hay que darlo de alta como herramienta externa:

1. **Agregar herramienta externa**
   - Entrá como usuario admin, en modo editor.
   - Andá a **Plugins → External tool → Manage tools → Add tool → Configure a tool manually**.
   - Cargá la configuración de conexión con el backend (URL, claves, etc.).

2. **Habilitar Web Services**
   - Andá a **Server → Overview** y asegurate de que **Enable web services** esté en `Yes`.
   - Generá y copiá el **token de seguridad** desde **Create a token for a user**. Ese token es el que va en `moodle.ws.token` de `application.properties`.

3. **Agregar la herramienta a un curso**
   - Creá un curso y sus temas.
   - En cada tema, agregá el material (PDF) y la herramienta externa configurada.

4. **Personalización del sitio** (opcional)
   - Logo institucional.
   - Nombre del sitio.
   - Nombres y fotos de usuarios de prueba.

5. **Completar `application.properties` con los datos de tu Moodle:**
```properties
   # issuer: donde está corriendo el LMS
   moodle.issuer=https://tu-moodle.com

   # auth-url: URL del LMS que autentica al usuario
   moodle.auth-url=https://tu-moodle.com/mod/lti/auth.php

   moodle.ws.base-url=https://tu-moodle.com/webservice/rest/server.php
   moodle.ws.token=TU_TOKEN_DE_WEB_SERVICES
```



---


##   EQUIPO


<details open>
<summary><strong> UX/UI</strong></summary>

- **Valeria Sestua** — [LinkedIn](https://www.linkedin.com/in/valeriasestua/)

</details>

<details open>
<summary><strong> Frontend</strong></summary>

- **Lucas Sorzio** — [LinkedIn](https://www.linkedin.com/in/lucas-sorzio/)

</details>

<details open>
<summary><strong> Backend</strong></summary>

- **Damián Zulcovsky** — [LinkedIn](https://www.linkedin.com/in/damianzulcovsky/)
- **Nicolas Bilic** — [LinkedIn](https://www.linkedin.com/in/nicolasbilic/)

</details>

<details open>
<summary><strong> QA</strong></summary>

- **Jacqueline Valenzuela** — [LinkedIn](https://www.linkedin.com/in/jacquelina/)
- **Tiziana Benegas** — [LinkedIn](https://www.linkedin.com/in/tiziana-benegas-la-valle-qa/)

</details>
