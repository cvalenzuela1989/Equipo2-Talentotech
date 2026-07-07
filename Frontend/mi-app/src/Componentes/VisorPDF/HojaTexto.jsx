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

  return (
    <div
      className="texto-dinamico"
      onContextMenu={manejarClickSecundario} 
      
      style={{
        backgroundColor: colorFondo,
        color: colorTexto,
        fontSize: `${tamanioLetra}px`,
        cursor: 'text',
        padding: '15px',
        borderRadius: '4px'
      }}
    >
      {lineasTexto.map((linea, index) => {
        if (linea.length < 40 && linea === linea.toUpperCase()) {
          return (
            <div
              key={index}
              style={{
                fontSize: `${tamanioLetra * 1.3}px`,
                color: colorTexto === '#334155' ? '#0f172a' : colorTexto,
                marginTop: '1.5rem',
                fontWeight: 'bold'
              }}
            >
              {linea}
            </div>
          );
        }
        return <p key={index} className="parrafo-dinamico">{linea}</p>;
      })}
    </div>
  );
}