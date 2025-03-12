import React from "react";
// Fix the duplicate imports by combining them
import { useRoutes, Routes, Route, BrowserRouter } from "react-router-dom";
import routes from "tempo-routes";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import { useEffect } from 'react';
import { initStorage } from './utils/storage';

function App() {
  useEffect(() => {
    // Inicializar el almacenamiento al cargar la aplicación
    initStorage().catch(error => {
      console.error("Error initializing storage:", error);
    });
  }, []);

  return (
    <div className="w-full h-screen bg-background">
      {/* Tempo routes */}
      {import.meta.env.VITE_TEMPO && useRoutes(routes)}

      <Routes>
        {/* Add this before any catchall route */}
        {import.meta.env.VITE_TEMPO && (
          <Route path="/tempobook/*" element={<div />} />
        )}

        <Route
          path="*"
          element={
            <div className="flex w-full h-screen bg-background">
              <Sidebar />
              <div className="flex-1 w-full">
                <ChatArea />
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

// Remove this line:
// import ... from "tempo-routes";

// If you need routing functionality, use react-router-dom instead:
// Remove this duplicate import line:
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
