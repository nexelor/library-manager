import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ScrollPositionProvider } from "./context/ScrollPositonContext";
import { ThemeProvider } from "./components/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <ScrollPositionProvider>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <AppRouter />
                </ThemeProvider>
            </ScrollPositionProvider>
        </BrowserRouter>
    </React.StrictMode>,
);