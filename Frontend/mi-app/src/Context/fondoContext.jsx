
import { createContext, useState, useEffect } from "react";



export const ColorContext = createContext();



export const ColorProvider = ({ children }) => { 

  const [colorFondo, setColorFondo] = useState("#1F2A44");

  const [colorTexto, setColorTexto] = useState("#0b0b0c");



  useEffect(() => {

    document.documentElement.style.setProperty("--color-fondo-dinamico", colorFondo);

    document.documentElement.style.setProperty("--color-texto-dinamico", colorTexto);

  }, [colorFondo, colorTexto]);

const colores = { colorFondo, setColorFondo, colorTexto, setColorTexto };

  return (

    <ColorContext.Provider value={colores}>

      {children}

    </ColorContext.Provider>

  );

} 