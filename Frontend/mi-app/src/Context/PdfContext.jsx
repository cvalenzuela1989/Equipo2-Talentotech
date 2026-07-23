import { createContext, useState, useEffect } from "react";
import * as pdfjsLib from 'pdfjs-dist';
// Importamos el worker como un módulo de Vite
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const PdfContext = createContext();

export const PdfProvider = ({ children }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [pdfData, setPdfData] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [mostrarFlashcards, setMostrarFlashcards] = useState(false);
    const [error, setError] = useState(null);
    const [visible, setVisible] = useState(false);
    const [resultado, setResultado] = useState({

  "quiz": [
      {
          "pregunta": "Pregunta 1",
          "opciones": [
              "Opción 1",
              "Opción 2",
              "Opción 3",
              "Opción 4"
          ],
          "respuestaCorrecta": "Respuesta Correcta"
      },
      {
          "pregunta": "Pregunta 2",
          "opciones": [
              "Opción 1",
              "Opción 2",
              "Opción 3",
              "Opción 4"
          ],
          "respuestaCorrecta": "Respuesta Correcta"
      },
      {
          "pregunta": "Pregunta 3",
          "opciones": [
              "Opción 1",
              "Opción 2",
              "Opción 3",
              "Opción 4"
          ],
          "respuestaCorrecta": "Respuesta Correcta"
      },
      {
          "pregunta": "Pregunta 4",
          "opciones": [
              "Opción 1",
              "Opción 2",
              "Opción 3",
              "Opción 4"
          ],
          "respuestaCorrecta": "Respuesta Correcta"
      },
      {
          "pregunta": "Pregunta 5",
          "opciones": [
              "Opción 1",
              "Opción 2",
              "Opción 3",
              "Opción 4"
          ],
          "respuestaCorrecta": "Respuesta Correcta"
      }
  ]
});
    
    // --- NUEVO ESTADO PARA LOS DATOS DEL USUARIO ---
    const [userData, setUserData] = useState(null);
    const [resultadoFlashCars, setResultadoFlashCars] = useState([
        { "frente": "Concepto 1", "reverso": "Fundamentos." },
        { "frente": "Concepto 2", "reverso": "Fundamentos." },
        { "frente": "Concepto 3", "reverso": "Fundamentos." },
        { "frente": "Concepto 4", "reverso": "Fundamentos." },
        { "frente": "Concepto 5", "reverso": "Fundamentos." },
        { "frente": "Concepto 6", "reverso": "Fundamentos." },
        { "frente": "Concepto 7", "reverso": "Fundamentos." },
        { "frente": "Concepto 8", "reverso": "Fundamentos." },
    ]);
    // 1. Lógica de procesamiento (ahora es una función reutilizable)
    const cargarDocumento = async (url) => {
        setCargando(true);
        setError(null);
        try {
            const urlMoodleEncodada = encodeURIComponent(url);
            const res = await fetch(`/api/v1/view?fileUrl=${urlMoodleEncodada}`);
         
            if (!res.ok) throw new Error("Error al obtener el PDF");

            const arrayBuffer = await res.arrayBuffer();
            const documentoPdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            // Procesamiento de texto
            let textoAcumulado = '';
            for (let i = 1; i <= documentoPdf.numPages; i++) {
                const pagina = await documentoPdf.getPage(i);
                const contenido = await pagina.getTextContent();
                textoAcumulado += contenido.items.map(item => item.str).join(' ') + '\n';
            }
           
            setPdfData(textoAcumulado);
            setPdfUrl(url);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };


    // --- EFECTO COMBINADO PARA PARÁMETROS DE URL ---
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        
        // 1. Capturar datos del usuario y del PDF desde los parámetros
        const userId = params.get('userId');
        const user = params.get('user');
        const email = params.get('email');
        const course = params.get('course');
        const section = params.get('section');
        const urlInicial = params.get('pdfUrl');

        // 2. Si vienen los datos del usuario, los guardamos en el estado
        if (userId) {
            setUserData({ userId, user, email, course, section, pdfUrl: urlInicial });
        }

        // 3. Si hay una URL de PDF, disparamos la carga del documento
        if (urlInicial) {
            cargarDocumento(urlInicial);
        }

        // 4. Limpiamos la URL para remover los parámetros por seguridad/estética
        if (userId || urlInicial) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []); 
  const enviarDatoFlashCars = async () => {
    if (!pdfData) return;
    try {
        const responseFlashCars = await fetch('http://localhost:8080/api/v1/flashcards', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: pdfData,
        });

        if (responseFlashCars.ok) {
            const dataFlashCars = await responseFlashCars.json();
            setResultadoFlashCars(dataFlashCars);
            
            // 🔹 Mostramos flashcards y OCULTAMOS el cuestionario
            setMostrarFlashcards(true);
            setVisible(false); 

            setTimeout(() => {
    requestAnimationFrame(() => {
        const seccion = document.getElementById("contenedor-herramientas");
        if (seccion) {
            const yOffset = -50; // Margen superior para que no quede pegado al borde
            const y = seccion.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    });
}, 100);
        }
    } catch (error) {
        console.error('Error al conectar con Spring Boot:', error);
    }
};

const enviarDato = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:8080/api/v1/quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: pdfData,
        });

        if (response.ok) {
            const data = await response.json();
            setResultado(data);
            
            // 🔹 Mostramos el cuestionario y OCULTAMOS las flashcards
            setVisible(true);
            setMostrarFlashcards(false); 
            
            setTimeout(() => {
    requestAnimationFrame(() => {
        const seccion = document.getElementById("contenedor-herramientas");
        if (seccion) {
            const yOffset = -50; // Margen superior para que no quede pegado al borde
            const y = seccion.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    });
}, 100);
        }
    } catch (error) {
        console.error('Error al conectar con Spring Boot:', error);
    }
};
    return (
        <PdfContext.Provider value={{ pdfUrl, pdfData, cargarDocumento, cargando, error, userData, resultadoFlashCars, 
            setResultadoFlashCars, visible,
            enviarDatoFlashCars,enviarDato,resultado,mostrarFlashcards , setMostrarFlashcards }}>
            {children}
        </PdfContext.Provider>
    );
};
