import React from 'react';

export default function HojaTexto({
  colorFondoPDF,
  colorTextoPDF,
  lineasTexto,
  tamanioLetra,
  setTextoGlobalSeleccionado,
  setMenuPosicion,
  palabraBuscada
}) {


  const resaltarTexto = (linea) => {
    if (!palabraBuscada || palabraBuscada.trim() === "") return linea;

   
    const escaparRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaparRegExp(palabraBuscada)})`, 'gi');
    
    const partes = linea.split(regex);
    return partes.map((parte, i) => 
      regex.test(parte) ? <mark key={i} style={{ backgroundColor: '#fde047', color: '#000' }}>{parte}</mark> : parte
    );
  };

  const handleMouseUp = (e) => {
    const seleccion = window.getSelection().toString().trim();
    if (seleccion.length > 0) {
      setTextoGlobalSeleccionado(seleccion);
      setMenuPosicion({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <div 
      className="hoja-texto"
      style={{
        backgroundColor: colorFondoPDF,
        color: colorTextoPDF,
        fontSize: `${tamanioLetra}px`,
        padding: '20px',
        borderRadius: '8px',
        lineHeight: '1.6'
      }}
      onMouseUp={handleMouseUp}
    >
      {lineasTexto.map((linea, index) => (
        <p key={index} style={{ margin: '0 0 10px 0' }}>
          {resaltarTexto(linea)}
        </p>
      ))}
    </div>
  );
}