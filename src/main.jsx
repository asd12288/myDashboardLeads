import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/styles.css";
import { BaseUrlProvider } from "./context/BaseUrlContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BaseUrlProvider>
      <App />
    </BaseUrlProvider>
  </StrictMode>
);
