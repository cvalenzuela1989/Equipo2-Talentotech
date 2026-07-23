import { MdLightMode, MdDarkMode, MdBrush } from "react-icons/md";
import { FaScroll } from "react-icons/fa";
import "./style.css";
import PaletaColor from "../../../Paleta/PaletaColor";

const ColorFondo = ({
  aplicarTemaPDF,
  colorFondoPDF,
  aplicarTemaFondo,
}) => {
  return (
    <div className="tema-card">

      <h5 className="tema-titulo">
        <MdBrush />
        Apariencia del PDF
      </h5>

      <div className="tema-botones">

        <button
          className="btn-tema claro"
          onClick={() => aplicarTemaPDF("#f0e7e7", "#334155")}
        >
          <MdLightMode />
          <span>Modo Claro</span>
        </button>

        <button
          className="btn-tema sepia"
          onClick={() => aplicarTemaPDF("#f4f1ea", "#433422")}
        >
          <FaScroll />
          <span>Modo Sepia</span>
        </button>

        <button
          className="btn-tema oscuro"
          onClick={() => aplicarTemaPDF("#1e293b", "#f8fafc")}
        >
          <MdDarkMode />
          <span>Modo Oscuro</span>
        </button>

      </div>

      <div className="color-picker-container">

        <label>
          Color personalizado
        </label>

        <input
          type="color"
          value={colorFondoPDF}
          onChange={(e) => aplicarTemaFondo(e.target.value)}
        />

      </div>

      <PaletaColor />

    </div>
  );
};

export default ColorFondo;