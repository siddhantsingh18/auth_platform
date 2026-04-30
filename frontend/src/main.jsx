import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "Syne, sans-serif",
              border: "2px solid #0a0a0f",
              boxShadow: "4px 4px 0px #0a0a0f",
              borderRadius: "2px",
              background: "#fff",
              color: "#0a0a0f",
            },
            success: {
              iconTheme: { primary: "#2d6a4f", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#e63946", secondary: "#fff" },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
