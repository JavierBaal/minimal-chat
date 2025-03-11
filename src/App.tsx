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
  // Add a simple console log to check if the component is rendering
  console.log("App component rendering");
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <ChatArea />
      </div>
    </div>
  );
}

export default App;
