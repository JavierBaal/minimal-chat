import React from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
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
