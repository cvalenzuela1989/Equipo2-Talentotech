import '../style.css';

const HerramientaVoz = ({ alEscuchar, alDetener }) => {
    
     
    
    return (<div className="botones">
            <button className="btn btn-success" onClick={alEscuchar}>Escuchar 🔊</button>
            <button className="btn btn-danger" onClick={alDetener}>Detener 🛑</button>
          </div>




    )
}
  export default HerramientaVoz;