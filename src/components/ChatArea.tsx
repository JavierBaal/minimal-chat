import React, { useState, useEffect } from "react";
import { callOpenAI } from "@/lib/api";
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/storage";
import { callOpenAIWithKnowledge } from "@/lib/api";
import { getFiles } from "@/lib/knowledgeBase";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatAreaProps {
  // Add any props you need
}

const ChatArea: React.FC<ChatAreaProps> = (props) => {
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Carga los mensajes guardados al inicio
  useEffect(() => {
    const savedMessages = getFromLocalStorage("chatMessages", []);
    if (savedMessages.length > 0) {
      // Convierte las fechas de string a Date
      const messagesWithDates = savedMessages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setLocalMessages(messagesWithDates);
    }
  }, []);

  // Guarda los mensajes cuando cambian
  useEffect(() => {
    if (localMessages.length > 0) {
      saveToLocalStorage("chatMessages", localMessages);
    }
  }, [localMessages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Crea un nuevo mensaje del usuario
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      sender: "user",
      timestamp: new Date(),
    };
  
    // Actualiza los mensajes locales
    setLocalMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
  
    // Indica que está cargando
    setIsLoading(true);
  
    try {
      // Obtén el prompt del sistema
      const systemPrompt = getFromLocalStorage(
        "systemPrompt", 
        "You are a helpful AI assistant. Answer questions accurately and concisely."
      );
      
      // Verifica si hay archivos en la base de conocimiento
      const hasKnowledgeFiles = getFiles().length > 0;
      
      // Llama a la API con o sin conocimiento según corresponda
      const aiResponse = hasKnowledgeFiles 
        ? await callOpenAIWithKnowledge(message, systemPrompt)
        : await callOpenAI(message, systemPrompt);
      
      // Crea un nuevo mensaje de la IA
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      
      // Actualiza los mensajes locales
      setLocalMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      // Maneja el error
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: `Error: ${error.message}. Por favor verifica tu configuración de API.`,
        sender: "ai",
        timestamp: new Date(),
      };
      
      setLocalMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {localMessages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.sender === "user"
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-muted mr-auto"
            } max-w-[80%]`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="bg-muted p-3 rounded-lg mr-auto max-w-[80%]">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }
            }}
            placeholder="Escribe un mensaje..."
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => handleSendMessage(inputMessage)}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-primary text-primary-foreground p-2 rounded-md disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
