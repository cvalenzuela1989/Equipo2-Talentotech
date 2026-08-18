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
##  Arquitectura

NEXA TOOL conecta tres piezas: **Moodle** (la plataforma LTI), el **Backend** (Spring Boot) y el **Frontend** (React). El flujo de comunicación es el siguiente:

### 1. Lanzamiento desde Moodle (LTI 1.3 / OIDC)
1. El usuario abre la herramienta externa dentro de un curso de Moodle.
2. Moodle envía una solicitud de login a `POST /lti/login` en el Backend.
3. El Backend redirige a Moodle (`moodle.auth-url`) para completar la autenticación OIDC (OpenID Connect), el protocolo que le permite al Backend confiar en la identidad del usuario sin pedirle usuario/contraseña propios.
4. Moodle responde con un `id_token` firmado (JWT) a `POST /lti/launch`.
5. El Backend decodifica el JWT, resuelve los datos del curso/sección/material vía `MoodleContentResolver`, y persiste el lanzamiento (`LtiPersistenceService`).
6. El Backend redirige al navegador hacia el **Frontend**, pasando los datos del contexto (usuario, curso, sección, URL del PDF) como query params.

### 2. Interacción en el Frontend
7. El Frontend solicita el PDF al Backend (`GET /api/v1/view`), que a su vez lo descarga desde Moodle y lo devuelve para visualizarlo en el visor embebido.
8. El usuario puede pedir funciones de IA (resumen, explicación simple, generación de quiz), que el Frontend solicita al Backend vía `/api/v1/summarize`, `/api/v1/explanation` y `/api/v1/quiz`.
9. Las preferencias de accesibilidad configurables (tamaño de letra, tipografía, paleta de colores, modo de lectura concentrada) se aplican al instante en el navegador y se envían de forma asíncrona a `POST /api/v1/events/accessibility`, que el Backend guarda en Firebase.
10. La lectura por voz es una acción puntual bajo demanda: el usuario selecciona un fragmento de texto y dispara la síntesis de voz (`SpeechSynthesis`) directamente en el navegador. No pasa por el Backend ni se persiste ningún estado.

### 3. Servicios externos
- **Firebase**: almacena las preferencias de accesibilidad por usuario.
- **Google Gemini (Spring AI)**: motor de IA detrás de resumen, explicación y generación de quiz.
- **Moodle Web Services**: usado por el Backend para resolver contenido del curso durante el `launch`.

```
Moodle   ──(login/launch OIDC)────────▶  Backend  ──(redirect + query params)──▶  Frontend
Frontend ──(GET /api/v1/view)──▶ Backend ──▶ Moodle ──▶ Backend ──▶ Frontend (PDF inline)
Frontend ──(POST /api/v1/summarize)───▶  Backend  ──▶ Gemini   (resumen)
Frontend ──(POST /api/v1/explanation)─▶  Backend  ──▶ Gemini   (explicación simple)
Frontend ──(POST /api/v1/quiz)────────▶  Backend  ──▶ Gemini   (generación de quiz)
Frontend ──(POST /api/v1/events/accessibility)──▶ Backend ──▶ Firebase
(preferencias configurables y persistentes: tamaño de letra, tipografía, paleta—>
 se aplican al instante y se guardan de forma asíncrona)

Frontend ──(no llega al Backend)
Acción: texto a voz (SpeechSynthesis del navegador — se dispara por selección de texto,
no se persiste ningún estado)
```
--- 

##  Puesta en marcha
### Frontend
```bash
cd Frontend/mi-app
npm install
npm run dev
```

### Backend

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
     > Si tu archivo se llama distinto, actualizá esta línea con el nombre real.
     > En despliegues de servidor (Render, Azure, etc.) se usa ,en cambio,
     la variable de entorno `FIREBASE_CONFIG_JSON`, pegando ahí el contenido completo del `.json` como texto.

4. **Configurá la conexión con Moodle:**
   ```properties
   # issuer: donde está corriendo el LMS
   moodle.issuer=https://tu-moodle.com

   # auth-url: URL del LMS que autentica al usuario
   moodle.auth-url=https://tu-moodle.com/mod/lti/auth.php

   moodle.ws.base-url=https://tu-moodle.com/webservice/rest/server.php
   moodle.ws.token=TU_TOKEN_DE_WEB_SERVICES
   ```
> El token de `moodle.ws.token` se obtiene desde Moodle en **Server** → **Overview** → **Create a token for a user**, luego de asegurarte que Enable web services esté en `Yes`.

5. **Levantá el servidor:**
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
### Variables de entorno para despliegue (producción)

En entornos de servidor (ej. Render, Azure) la configuración no se carga en `application.properties`, sino como variables de entorno del servicio:

| Variable | Para qué sirve |
|---|---|
| `GOOGLE_AI_API_KEY` | Clave de la API de Gemini (funciones de IA: resumen, explicación, quiz, flashcards) |
| `FIREBASE_CONFIG_JSON` | Contenido completo del `.json` de credenciales de Firebase, pegado como texto plano |
| `FRONT_URL` | URL donde corre el frontend desplegado (usada por el backend para CORS/redirects) |
| `PORT` | Puerto en el que escucha el backend; lo suele definir la plataforma de hosting automáticamente |

> Estas variables se cargan desde el panel de **Environment** de la plataforma de despliegue.

---
### Endpoints de la API

El backend expone los siguientes endpoints principales. La documentación interactiva (Swagger UI), con el detalle completo de parámetros y respuestas, está disponible en: [https://lti-accessibility-tool.onrender.com/swagger-ui/index.html](https://lti-accessibility-tool.onrender.com/swagger-ui/index.html)

| Método | Endpoint | Qué hace |
|---|---|---|
| `POST` | `/lti/login` | Primer paso del flujo OIDC de LTI 1.3: recibe los parámetros de Moodle y redirige al `auth-url` del LMS para autenticar al usuario |
| `POST` | `/lti/launch` | Recibe el `id_token` firmado por Moodle, decodifica los datos del lanzamiento (usuario, curso, PDF, etc.), los persiste y redirige al Frontend con esos datos como query params |
| `GET` | `/api/v1/view` | Trae el PDF desde la URL de Moodle (`fileUrl`) y lo devuelve para mostrarlo embebido en el visor del Frontend (respuesta `inline`, sin opción de descarga para el usuario) |
| `POST` | `/api/v1/summarize` | Recibe un texto en el body y devuelve un resumen generado por IA con las ideas clave |
| `POST` | `/api/v1/explanation` | Recibe un texto en el body y devuelve una explicación simplificada generada por IA |
| `POST` | `/api/v1/quiz` | Recibe un texto en el body y genera automáticamente un cuestionario (quiz) de autoevaluación con IA |
| `POST` | `/api/v1/events/accessibility` | Recibe las preferencias de accesibilidad configuradas por el usuario en el Frontend (tipografía, contraste, etc.) y responde de inmediato, delegando el guardado en Firebase a un proceso asíncrono |

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
