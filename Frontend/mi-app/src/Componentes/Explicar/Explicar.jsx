import { useContext } from "react";
import { PdfContext } from "../../Context/PdfContext";
import { MdLightbulb, MdAutoAwesome } from "react-icons/md";
import "./style.css";

const Explicacion = ({ solicitarExplicacion }) => {
  const { pdfData } = useContext(PdfContext);

  return (
    <div className="explicacion-card" style={{ marginBottom: '20px' }}>
      <div className="explicacion-header">
        <MdLightbulb className="explicacion-icono" />
        <div>
          <h5>Explicación Inteligente</h5>
          <p>Obtené una explicación detallada del documento.</p>
        </div>
      </div>

      <button
        onClick={() => solicitarExplicacion(pdfData)}
        className="btn-explicar"
      >
        <MdAutoAwesome size={22} />
        Generar Explicación
      </button>
    </div>
  );
};

export default Explicacion;