export default function HojaTexto({ lineasTexto, colorFondo, colorTexto, tamanioLetra }) {
  return (
    <div
      className="hoja-render"
      style={{
        backgroundColor: colorFondo,
        color: colorTexto,
        fontSize: `${tamanioLetra}px`
      }}
    >
      {lineasTexto.map((linea, index) => {
        
        if (linea.length < 40 && linea === linea.toUpperCase()) {
          return (
            <h2
              key={index}
              style={{
                fontSize: `${tamanioLetra * 1.3}px`,
                color: colorTexto === '#334155' ? '#0f172a' : colorTexto,
                marginTop: '1.5rem'
              }}
            >
              {linea}
            </h2>
          );
        }
        
        return <p key={index} className="parrafo-dinamico">{linea}</p>;
      })}
    </div>
  );
}