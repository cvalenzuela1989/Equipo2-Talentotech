import { PdfContext } from '../../../Context/PdfContext.jsx';
import { useContext } from 'react';

export default function HojaTexto({
  colorFondoPDF,
  colorTextoPDF,
  tamanioLetra,
  setTextoGlobalSeleccionado,
  setMenuPosicion,
  palabraBuscada
}) {
  const { resultadoTitleAndSections } = useContext(PdfContext);

  const resaltarTexto = (texto) => {
    if (!texto || typeof texto !== 'string') return texto;
    if (!palabraBuscada || palabraBuscada.trim() === "") return texto;

    const escaparRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaparRegExp(palabraBuscada)})`, 'gi');
    
    const partes = texto.split(regex);
    return partes.map((parte, i) => 
      regex.test(parte) ? <mark key={i} style={{ backgroundColor: '#fde047', color: 'black' }}>{parte}</mark> : parte
    );
  };

  const handleMouseUp = (e) => {
    const seleccion = window.getSelection().toString().trim();
    if (seleccion.length > 0) {
      setTextoGlobalSeleccionado(seleccion);
      setMenuPosicion({ x: e.clientX, y: e.clientY });
    }
  };

  // Extraemos las secciones de forma segura desde el objeto de la IA
  const secciones = resultadoTitleAndSections?.secciones || [];

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
      onContextMenu={(e) => e.preventDefault()}
      onMouseUp={handleMouseUp}
    >
      {/* 1. Título principal de la IA */}
      {resultadoTitleAndSections?.titulo && (
        <h1 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '10px', wordBreak: 'break-word', color:"colorTextoPDF" }}>
          {resaltarTexto(resultadoTitleAndSections.titulo)}
        </h1>
      )}

      {/* 2. Subtítulo de la IA */}
      {resultadoTitleAndSections?.subtitulo && (
        <h5 style={{ fontStyle: 'italic', marginBottom: '25px', opacity: 0.85, wordBreak: 'break-word',color:"colorTextoPDF" }}>
          {resaltarTexto(resultadoTitleAndSections.subtitulo)}
        </h5>
      )}

      {/* 3. Mapeo exacto de las secciones (título de sección y contenido) */}
      {secciones.length > 0 ? (
        secciones.map((seccion, indice) => (
          <div key={indice} style={{ marginBottom: '25px' }}>
            {seccion.titulo_seccion && (
              <h2 style={{ fontSize: '1.4em', fontWeight: 'bold', marginBlock: '15px', wordBreak: 'break-word' }}>
                {resaltarTexto(seccion.titulo_seccion)}
              </h2>
            )}
            {seccion.contenido && (
              <p style={{ margin: '0 0 10px 0', wordBreak: 'break-word' }}>
                {resaltarTexto(seccion.contenido)}
              </p>
            )}
          </div>
        ))
      ) : (
        <p style={{ fontStyle: 'italic', opacity: 0.7, textAlign: 'center' }}>
          Esperando datos de la IA o documento no procesado...
        </p>
      )}
    </div>
  );
}