import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Analytics } from "@vercel/analytics/react";

import App from "./App";
import { LanguageProvider } from "./context/LanguageProvider";
import "./styles/editorial.css";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
        <Analytics/>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
