


const TamañoLetra = ({ tamaño, setTamaño }) => {
  



    return (

 <div className="grupo-control">
          <h5>Tamaño de Letra</h5>
            <div className="botones">
            <button className="btn " onClick={() => setTamaño(prev => Math.max(12, prev - 2))}>A-</button>
            <p >{tamaño}px</p>
            <button className="btn " onClick={() => setTamaño(prev => prev + 2)}>A+</button>
          </div>
        </div>


    )
};
  export default TamañoLetra;