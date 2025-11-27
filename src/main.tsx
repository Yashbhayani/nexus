
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { APIState } from "./Context/apimethods/APIState.jsx";

createRoot(document.getElementById("root")!).render(
  <APIState> <App /> </APIState>);
