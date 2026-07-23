import { useContext } from "react";
import { PdfContext } from "../../../Context/PdfContext";
import { MdAutoAwesome } from "react-icons/md";
import "./style.css";

const Resumen = ({ solicitarResumen }) => {
  const { pdfData } = useContext(PdfContext);

  return (
    <div className="resumen-card">

      <div className="resumen-header">
        <MdAutoAwesome className="resumen-icono" />

        <div>
          <h5>Resumen Inteligente</h5>
          <p>Obtenga un resumen rápido del documento.</p>
        </div>
      </div>

      <button
        onClick={() => solicitarResumen(pdfData)}
        className="btn-resumen"
      >
        <MdAutoAwesome size={22} />
        Generar Resumen
      </button>

    </div>
  );
};

export default Resumen;