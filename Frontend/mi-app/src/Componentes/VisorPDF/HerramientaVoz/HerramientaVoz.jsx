import {
  MdRecordVoiceOver,
  MdVolumeUp,
  MdStopCircle
} from "react-icons/md";

import "./style.css";

const HerramientaVoz = ({ alEscuchar, alDetener }) => {
  return (
    <div className="voz-card">

      <div className="voz-header">
        <MdRecordVoiceOver className="voz-icono" />
        <h5>Lectura por voz</h5>
      </div>

      <p className="voz-descripcion">
        Escuchá el contenido del documento mediante síntesis de voz.
      </p>

      <div className="voz-botones">

        <button
          className="btn-voz escuchar"
          onClick={alEscuchar}
        >
          <MdVolumeUp />
          <span>Escuchar</span>
        </button>

        <button
          className="btn-voz detener"
          onClick={alDetener}
        >
          <MdStopCircle />
          <span>Detener</span>
        </button>

      </div>

    </div>
  );
};

export default HerramientaVoz;