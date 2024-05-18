import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import PropTypes from "prop-types";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "./index.scss";

function PDFViewer({ url }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <div className="pdf-container">
      <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
    </div>
  );
}

PDFViewer.propTypes = {
  url: PropTypes.string.isRequired,
};

export default PDFViewer;
