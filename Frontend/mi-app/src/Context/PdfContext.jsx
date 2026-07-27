import { createContext, useState, useEffect } from "react";
import * as pdfjsLib from 'pdfjs-dist';
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
    
    // Estado global para el menú de herramientas (PanelHerramientas)
    const [menuAbierto, setMenuAbierto] = useState(false);
   
    const [resultado, setResultado] = useState({
        "quiz": [
            {
                "pregunta": "Pregunta 1",
                "opciones": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
                "respuestaCorrecta": "Respuesta Correcta"
            },
            {
                "pregunta": "Pregunta 2",
                "opciones": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
                "respuestaCorrecta": "Respuesta Correcta"
            },
            {
                "pregunta": "Pregunta 3",
                "opciones": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
                "respuestaCorrecta": "Respuesta Correcta"
            },
            {
                "pregunta": "Pregunta 4",
                "opciones": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
                "respuestaCorrecta": "Respuesta Correcta"
            },
            {
                "pregunta": "Pregunta 5",
                "opciones": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
                "respuestaCorrecta": "Respuesta Correcta"
            }
        ]
    });
    
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

    const [resultadoTitleAndSections, setResultadoTitleAndSections] = useState({});
    const [resultadoSeccionesTitleAndSections, setResultadoSeccionesTitleAndSections] = useState({});

    const cargarDocumento = async (url) => {
        setCargando(true);
        setError(null);
        try {
            const urlMoodleEncodada = encodeURIComponent(url);
            const res = await fetch(`/api/v1/view?fileUrl=${urlMoodleEncodada}`);
         
            if (!res.ok) throw new Error("Error al obtener el PDF");

            const arrayBuffer = await res.arrayBuffer();
            const documentoPdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
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

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('userId');
        const user = params.get('user');
        const email = params.get('email');
        const course = params.get('course');
        const section = params.get('section');
        const urlInicial = params.get('pdfUrl');

        if (userId) {
            setUserData({ userId, user, email, course, section, pdfUrl: urlInicial });
        }

        if (urlInicial) {
            cargarDocumento(urlInicial);
        }

        if (userId || urlInicial) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []); 

    const enviarDatoTitleAndSections = async () => {
        if (!pdfData) return; 
        try {
            const responseTitleAndSections = await fetch('http://localhost:8080/api/v1/titleAndSections', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: pdfData, 
            });

            if (responseTitleAndSections.ok) {
                const dataTitleAndSections = await responseTitleAndSections.json();
                setResultadoTitleAndSections(dataTitleAndSections);
                setResultadoSeccionesTitleAndSections(dataTitleAndSections.secciones);
            }
        } catch (error) {
            console.error('Error al conectar con Spring Boot:', error);
        }
    };

    useEffect(() => {
        if (pdfData) {
            enviarDatoTitleAndSections();
        }
    }, [pdfData]);

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
                setMostrarFlashcards(true);
                setVisible(false); 
            }
        } catch (error) {
            console.error('Error al conectar con Spring Boot:', error);
        }
    };

    const enviarDato = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!pdfData) return;

        try {
            const response = await fetch('http://localhost:8080/api/v1/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: pdfData,
            });

            if (response.ok) {
                const data = await response.json();
                setResultado(data);
                setVisible(true); 
                setMostrarFlashcards(false); 
            }
        } catch (error) {
            console.error('Error al conectar con Spring Boot:', error);
        }
    };

    return (
        <PdfContext.Provider value={{ 
            pdfUrl, pdfData, cargarDocumento, cargando, error, userData, 
            resultadoFlashCars, setResultadoFlashCars, visible, setVisible, 
            enviarDatoFlashCars, enviarDato, resultado, mostrarFlashcards, setMostrarFlashcards,
            enviarDatoTitleAndSections, resultadoTitleAndSections, resultadoSeccionesTitleAndSections,
            menuAbierto, setMenuAbierto,
        }}>
            {children}
        </PdfContext.Provider>
    );
};