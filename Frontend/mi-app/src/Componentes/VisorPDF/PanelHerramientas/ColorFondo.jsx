import '../style.css';


const colorFondo = ({aplicarTema}) => {
    

    return (
        

 <div className="botones"> 
            <button onClick={() => aplicarTema('#f0e7e7', '#334155')} className="btn btn-light border text-start">☀️ Modo Claro</button>
            <button onClick={() => aplicarTema('#f4f1ea', '#433422')} className="btn text-start" style={{ backgroundColor: '#f4f1ea', color: '#433422', border: '1px solid #dcd7ca' }}>📜 Modo Sepia</button>
            <button onClick={() => aplicarTema('#1e293b', '#f8fafc')} className="btn btn-dark text-start">🌙 Modo Oscuro</button>
          </div>




    )
} 
export default colorFondo;