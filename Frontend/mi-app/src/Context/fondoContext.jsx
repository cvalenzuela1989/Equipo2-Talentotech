
import { createContext, useState, useEffect } from "react";



export const ColorContext = createContext();



export const ColorProvider = ({ children }) => { 

  const [colorFondo, setColorFondo] = useState("#1a1a1a");

  const [colorTexto, setColorTexto] = useState("#ffffff");



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

