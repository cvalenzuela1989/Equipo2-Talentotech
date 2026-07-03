export default function SelectorArchivo({ cargando, alProcesarPDF }) {
  return (
    <div className="control-panel">
      <input type="file" accept="application/pdf" onChange={alProcesarPDF} />
      {cargando && <span> Cargando capas del documento...</span>}
    </div>
  );
}