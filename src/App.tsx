import React from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import routes from "tempo-routes";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";

function App() {
  // Add a simple console log to check if the component is rendering
  console.log("App component rendering");

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
