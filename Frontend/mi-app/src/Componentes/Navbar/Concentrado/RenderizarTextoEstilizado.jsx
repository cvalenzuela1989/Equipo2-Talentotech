const RenderizarTextoEstilizado = ({ texto }) => {
  if (!texto) return null;

  // Esto crea párrafos y oraciones manejables
  return texto.split(/[.!?\n]+/).map((oracion, index) => {
    const trimmed = oracion.trim();
    if (trimmed.length < 5) return null; 
    
    return (
      <p key={index} style={{ 
        marginBottom: '1.5rem', 
        lineHeight: '1.8',      // Interlineado más generoso para que respire el texto
        fontSize: '1.15rem',    // Letra un pelo más grande
        textAlign: 'left',      // Left cansa menos la vista que justify en modo oscuro
        opacity: 0.9            // Suaviza un poco más el contraste
      }}>
        {trimmed}.
      </p>
    );
  });
};

export default RenderizarTextoEstilizado;