const RenderizarTextoEstilizado = ({ texto  }) => {
  if (!texto) return null;
  
  // Dividimos el texto por puntos y seguido o saltos de línea
  // Esto crea párrafos y oraciones manejables
  return texto.split(/[.!?\n]+/).map((oracion, index) => {
    const trimmed = oracion.trim();
    if (trimmed.length < 5) return null; // Ignorar fragmentos muy cortos
    
    return (
      <p key={index} style={{ 
        marginBottom: '1rem', 
        lineHeight: '1.6', 
        fontSize: '1.1rem',
        textAlign: 'justify' 
      }}>
        {trimmed}.
      </p>
    );
  });
};
export default RenderizarTextoEstilizado;