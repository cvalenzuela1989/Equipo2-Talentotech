import { MdFormatSize, MdPalette } from "react-icons/md";
import './styleLetra.css';

const TamañoLetra = ({ tamaño, setTamaño, aplicarTemaTexto, colorTextoPDF }) => {
    return (
        <div className="grupo-control">

    <h5 className="flex ">
        <MdFormatSize style={{marginRight:8}}/>
        Tamaño de letra
    </h5>

    <div className="tamaño-container">

        <div className="botones-tamano">

            <button
                className="boton"
                onClick={() => setTamaño(prev => Math.max(12, prev - 2))}
            >
                A-
            </button>

            <span className="valor-px">
                {tamaño}px
            </span>

            <button
                className="boton"
                onClick={() => setTamaño(prev => prev + 2)}
            >
                A+
            </button>

        </div>

        <div className="selector-texto">

            <label>

                <MdPalette
                    style={{marginRight:6}}
                />

                Color de letra

            </label>

            <input
                type="color"
                value={colorTextoPDF}
                onChange={(e)=>aplicarTemaTexto(e.target.value)}
            />

        </div>

    </div>

</div>
    );
};

export default TamañoLetra;