import "./App.scss";
import { ToastContainer } from "react-toastify";
import Guest from "./pages/Guest";
import { AuthContext } from "./providers/AuthProvider";
import { useContext } from "react";
import User from "./pages/User";
import { Worker } from "@react-pdf-viewer/core";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { authUser } = useContext(AuthContext);
  console.log(authUser);
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      {authUser ? <User /> : <Guest />}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop={true}
        closeOnClick
        pauseOnHover={true}
        pauseOnFocusLoss={false}
        style={{ textAlign: "left" }}
      />
      {/* <Footer/> */}
    </Worker>
  );
}

export default App;
