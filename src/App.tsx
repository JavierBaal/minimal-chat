import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import KnowledgeBaseManager from "./components/KnowledgeBaseManager";
import { getFromLocalStorage } from "./lib/storage";

function App() {
  const [isPinSetup, setIsPinSetup] = useState(!!getFromLocalStorage("securePin", ""));
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);

  const handleSetupPin = () => {
    setIsPinSetup(true);
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
