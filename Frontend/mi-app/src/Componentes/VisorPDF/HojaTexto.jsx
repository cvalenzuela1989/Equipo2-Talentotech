import './style.css';

export default function HojaTexto({ 
  lineasTexto, 
  colorFondo, 
  colorTexto, 
  tamanioLetra, 
  setTextoGlobalSeleccionado,
  setMenuPosicion 
}) {
  
  const manejarClickSecundario = (e) => {
    const seleccion = window.getSelection();
    const texto = seleccion.toString().trim();

    if (texto.length > 0) {
      e.preventDefault(); 
      setTextoGlobalSeleccionado(texto);
      setMenuPosicion({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const esTituloReal = (linea) => {
    return (
      linea.length < 40 && 
      linea === linea.toUpperCase() && 
      !linea.endsWith('.') && 
      !linea.endsWith('?') && 
      !linea.endsWith('!')
    );
  };

  return (
    <div
      className="texto-dinamico"
      onContextMenu={manejarClickSecundario} 
      style={{
        backgroundColor: colorFondo,
        color: colorTexto,
        fontSize: `${tamanioLetra}px`,
        cursor: 'text',
        padding: '24px',
        borderRadius: '8px',
        lineHeight: '1.5',        // Interlineado natural y cómodo
        textAlign: 'left'         // Alineación a la izquierda para mejor lectura
      }}
    >
      {lineasTexto.map((linea, index) => {
        if (esTituloReal(linea)) {
          return (
            <h3
              key={index}
              style={{
                fontSize: `${tamanioLetra * 1.25}px`,
                color: colorTexto === '#0d64dd' ? '#0f172a' : colorTexto,
                marginTop: '1.5rem',
                marginBottom: '0.5rem',
                fontWeight: '700'
              }}
            >
              {linea}
            </h3>
          );
        }
        
        // 🌟 SOLUCIÓN: Usamos un fragmento con un <br /> para saltar de renglón
        // sin meter los márgenes pesados que tienen las etiquetas <p>
        return (
          <span key={index} style={{ display: 'block', marginBottom: '4px' }}>
            {linea}
          </span>
        );
      })}
    </div>
  );
}