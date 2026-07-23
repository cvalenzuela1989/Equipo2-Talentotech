

import {
  MdTextFields,
  MdFontDownload,
  MdCheck
} from "react-icons/md";

import "./style.css";

const Tipografia = ({ cambiarLetra }) => {
  return (
    <div className="tipografia-card">

      <div className="tipografia-header">
        <MdTextFields className="titulo-icono" />
        <h5>Tipografía</h5>
      </div>

      <p className="tipografia-descripcion">
        Elegí la fuente que te resulte más cómoda para leer.
      </p>

      <div className="tipografia-lista">

        <button
          className="btn-tipografia"
          onClick={() => cambiarLetra("sans-serif")}
        >
          <div className="tipografia-info">
            <MdFontDownload />
            <div>
              <strong>Normal</strong>
              <small>Fuente predeterminada</small>
            </div>
          </div>

          
        </button>

        <button
          className="btn-tipografia"
          onClick={() => cambiarLetra("Nunito")}
        >
          <div className="tipografia-info">
            <MdFontDownload />
            <div>
              <strong>Nunito</strong>
              <small>Lectura suave y moderna</small>
            </div>
          </div>

          
        </button>

        <button
          className="btn-tipografia"
          onClick={() => cambiarLetra("OpenDyslexic")}
        >
          <div className="tipografia-info">
            <MdFontDownload />
            <div>
              <strong>OpenDyslexic</strong>
              <small>Diseñada para personas con dislexia</small>
            </div>
          </div>

          
        </button>

      </div>

    </div>
  );
};

export default Tipografia;