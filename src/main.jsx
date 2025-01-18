import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/styles.css";
import { BaseUrlProvider } from "./context/BaseUrlContext.jsx";
import { Toaster, resolveValue } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BaseUrlProvider>
      <App />
    </BaseUrlProvider>
    <Toaster
      position="top-center"
      gutter={12}
      containerStyle={{ margin: "8px" }}
      toastOptions={{
        success: {
          duration: 3000,
        },
        error: {
          duration: 5000,
        },
        style: {
          fontSize: "16px",
          maxWidth: "500px",
          padding: "16px 24px",
          backgroundColor: "white",
          color: "var(--color-grey-700)",
        },
      }}
    />
  </StrictMode>
);
