
import { createContext, useState, useEffect } from "react";



export const ColorContext = createContext();



export const ColorProvider = ({ children }) => { 

  const [colorFondo, setColorFondo] = useState("#DAE9F0");

  const [colorTexto, setColorTexto] = useState("#08060d");



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