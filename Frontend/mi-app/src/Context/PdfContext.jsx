import { createContext, useState, useEffect } from "react";
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const PdfContext = createContext();

export const PdfProvider = ({ children }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [markdownResult, setMarkdownResult] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Estados para controlar visibilidad y menú
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mostrarFlashcards, setMostrarFlashcards] = useState(false);

   
    const [cargandoQuiz, setCargandoQuiz] = useState(false);
    const [cargandoFlashcards, setCargandoFlashcards] = useState(false);
  ; 
  // Estados restaurados con Mocks iniciales
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

  const [resultadoFlashCars, setResultadoFlashCars] = useState([
    { "frente": "Concepto 1", "reverso": "Fundamentos." },
    { "frente": "Concepto 2", "reverso": "Fundamentos." },
    { "frente": "Concepto 3", "reverso": "Fundamentos." },
    { "frente": "Concepto 4", "reverso": "Fundamentos." },
    { "frente": "Concepto 5", "reverso": "Fundamentos." },
    { "frente": "Concepto 6", "reverso": "Fundamentos." },
    { "frente": "Concepto 7", "reverso": "Fundamentos." },
    { "frente": "Concepto 8", "reverso": "Fundamentos." }
  ]);

  const [resultadoTitleAndSections, setResultadoTitleAndSections] = useState({});
  const [resultadoSeccionesTitleAndSections, setResultadoSeccionesTitleAndSections] = useState('');

  /**
   * 1. Algoritmo de extracción gráfica a Markdown (Calibrado)
   */
  const parsePdfItemsToMarkdown = (items, pageNum) => {
    if (!items || items.length === 0) return '';

    const itemsFiltrados = items.filter((item) => {
      const text = (item.str || '').trim();
      if (!text) return false;
      const y = Math.round(item.transform[5]);

      if ((y > 780 || y < 50) && /^[-–—]?\s*\d+\s*[-–—]?$/.test(text)) return false; 
      if (/^Página\s+\d+$/i.test(text)) return false;
      if (pageNum > 1 && text.toLowerCase().includes('historia de la informática') && y > 730) return false;

      return true;
    });

    if (itemsFiltrados.length === 0) return '';

    const fontSizes = itemsFiltrados
      .map((item) => Math.abs(item.transform[0] || item.height || 0))
      .filter(Boolean)
      .sort((a, b) => a - b);

    const medianFontSize = fontSizes.length
      ? fontSizes[Math.floor(fontSizes.length / 2)]
      : 12;

    const linesMap = new Map();

    itemsFiltrados.forEach((item) => {
      const text = item.str;
      const y = Math.round(item.transform[5]);
      const fontSize = Math.abs(item.transform[0] || item.height || medianFontSize);
      const width = item.width || (text.length * (fontSize * 0.5)); 

      let lineKey = Array.from(linesMap.keys()).find((k) => Math.abs(k - y) < 4);
      if (lineKey === undefined) {
        lineKey = y;
        linesMap.set(lineKey, { y, fontSize, textItems: [] });
      }

      linesMap.get(lineKey).textItems.push({ text, x: item.transform[4], width });
    });

    const lines = Array.from(linesMap.values()).sort((a, b) => b.y - a.y);
    let mdResult = '';
    let lastY = null;
    let inList = false;

    lines.forEach((lineObj) => {
      lineObj.textItems.sort((a, b) => a.x - b.x);

      let lineText = '';
      for (let i = 0; i < lineObj.textItems.length; i++) {
        const currentItem = lineObj.textItems[i];
        lineText += currentItem.text;
        
        if (i < lineObj.textItems.length - 1) {
          const nextItem = lineObj.textItems[i + 1];
          const gap = nextItem.x - (currentItem.x + currentItem.width);
          
          if (gap > lineObj.fontSize * 4) {
            lineText += ' — ';
          } else if (gap > lineObj.fontSize * 0.15) {
            if (!lineText.endsWith(' ')) lineText += ' ';
          }
        }
      }

      lineText = lineText.replace(/\s+/g, ' ').trim();
      if (!lineText) return;

      const fontSize = lineObj.fontSize;
      const currentY = lineObj.y;
      const isNewBlock = lastY !== null && Math.abs(lastY - currentY) > medianFontSize * 1.6;

      // --- DETECCIÓN DE TÍTULOS Y SUBTÍTULOS ---
      if (/^(18|19|20)\d{2}$/.test(lineText)) {
        mdResult += `\n\n### ${lineText}\n\n`;
        inList = false;
      } 
      else if (fontSize > medianFontSize * 1.45) {
        mdResult += `\n\n# ${lineText}\n\n`;
        inList = false;
      } 
      else if (fontSize > medianFontSize * 1.10) {
        mdResult += `\n\n## ${lineText}\n\n`;
        inList = false;
      } 
      else if (fontSize > medianFontSize * 1.03) {
        mdResult += `\n\n### ${lineText}\n\n`;
        inList = false;
      } 
      else if (/^[•\-\*]\s|^\d+[\.\)]\s/.test(lineText)) {
        const cleanText = lineText.replace(/^[•\-\*]\s*/, '');
        mdResult += `\n* ${cleanText}`;
        inList = true;
      } 
      else {
        if (inList && !isNewBlock) {
          mdResult += `\n  ${lineText}`;
        } else if (isNewBlock) {
          mdResult += `\n\n${lineText}`;
          inList = false;
        } else {
          if (mdResult.endsWith('-')) {
            mdResult = mdResult.slice(0, -1) + lineText;
          } else {
            mdResult += ` ${lineText}`;
          }
        }
      }

      lastY = currentY;
    });

    mdResult = mdResult.replace(/,([^\s])/g, ', $1');

    return mdResult.trim();
  };

  /**
   * 2. Descarga del PDF de Moodle y procesamiento en React
   */
  const cargarDocumento = async (url) => {
    if (!url || cargando || pdfUrl === url) return; 

    // Seteo del título de la pestaña utilizando el nombre del archivo PDF
    try {
      const rutaLimpia = url.split("?")[0];
      const nombreArchivo = rutaLimpia.split("/").pop();
      if (nombreArchivo) {
        const tituloFormateado = decodeURIComponent(nombreArchivo)
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ");
        document.title = `NEXA | ${tituloFormateado}`;
      } else {
        document.title = "NEXA";
      }
    } catch {
      document.title = "NEXA";
    }

    setCargando(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
      const urlTuApi = `${baseUrl}/api/v1/view?fileUrl=${encodeURIComponent(url)}`;
      
      const res = await fetch(urlTuApi);
      if (!res.ok) throw new Error(`Error ${res.status}: El backend no pudo procesar el PDF`);

      const arrayBuffer = await res.arrayBuffer();
      const documentoPdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let textoAcumulado = '';
      let markdownAcumulado = '';

      for (let i = 1; i <= documentoPdf.numPages; i++) {
        const pagina = await documentoPdf.getPage(i);
        const contenido = await pagina.getTextContent();

        textoAcumulado += contenido.items.map(item => item.str).join(' ') + '\n';
        
        const paginaMarkdown = parsePdfItemsToMarkdown(contenido.items, i);
        
        markdownAcumulado += `\n\n---\n*Página ${i}*\n\n${paginaMarkdown}`;
      }

      const markdownLimpio = markdownAcumulado.trim();

      setPdfData(textoAcumulado);
      setMarkdownResult(markdownLimpio);
      setResultadoSeccionesTitleAndSections(markdownLimpio);
      setResultadoTitleAndSections({ secciones: markdownLimpio });
      setPdfUrl(url);

    } catch (err) {
      console.error("Error al procesar con el backend:", err);
      setError(err.message || "Error de comunicación con el backend");
    } finally {
      setCargando(false);
    }
  };

  /**
   * 3. Peticiones asíncronas POST al backend
   */
  const enviarDatoFlashCars = async () => {
    if (!pdfData) return;
     setCargandoFlashcards(true);
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
      const urlTuApi = `${baseUrl}/api/v1/flashcards`;
      const responseFlashCars = await fetch(urlTuApi, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: pdfData,
      });
      if (responseFlashCars.ok) {
        const dataFlashCars = await responseFlashCars.json();
         setCargandoFlashcards(false);
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
    setCargandoQuiz(true)
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
      const urlTuApi = `${baseUrl}/api/v1/quiz`;
      const response = await fetch(urlTuApi, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: pdfData,
      });
      if (response.ok) {
        const data = await response.json();
        setResultado(data);
        setVisible(true);
        setMostrarFlashcards(false);
        setCargandoQuiz(false)
      }
    } catch (error) {
      console.error('Error al conectar con Spring Boot:', error);
    }
  };

  /**
   * 4. Lee automáticamente los parámetros de la URL en la carga inicial
   */
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const userId = queryParams.get("userId");
    const user = queryParams.get("user") || queryParams.get("username") || queryParams.get("nombre");
    const email = queryParams.get("email");
    const course = queryParams.get("course");
    const section = queryParams.get("section");
    const urlDesdeParams = queryParams.get("pdfUrl");

    if (userId || user || email) {
      setUserData({ userId, user, email, course, section });
    }

    if (urlDesdeParams) {
      cargarDocumento(urlDesdeParams);
    }

    if (userId || urlDesdeParams) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <PdfContext.Provider value={{
      pdfUrl,
      pdfData,
      markdownResult,
      cargando,
      error,
      cargarDocumento,
      userData,
      menuAbierto,
      setMenuAbierto,
      visible,
      setVisible,
      mostrarFlashcards,
      setMostrarFlashcards,
      resultado,
      setResultado,
      resultadoFlashCars,
      setResultadoFlashCars,
      enviarDato,
      enviarDatoFlashCars,
      resultadoTitleAndSections,
      resultadoSeccionesTitleAndSections,
      cargandoQuiz,
      cargandoFlashcards,
    }}>
      {children}
    </PdfContext.Provider>
  );
};