import React, { useState, useEffect, useRef } from "react";
import { callAI, callAIWithKnowledge } from "@/lib/api";
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/storage";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [aiName, setAiName] = useState(
    getFromLocalStorage("aiName", "Mentor Bukowski")
  );

  // Add an effect to listen for changes to the AI name
  useEffect(() => {
    // Function to handle storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "aiName" && e.newValue) {
        setAiName(e.newValue);
      }
    };

    // Add event listener
    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Add this to the existing useEffect or create a new one
  useEffect(() => {
    // Function to handle AI name changes
    const handleAiNameChange = (e: CustomEvent) => {
      setAiName(e.detail);
    };
  
    // Add event listener
    window.addEventListener("aiNameChanged", handleAiNameChange as EventListener);
  
    // Cleanup
    return () => {
      window.removeEventListener("aiNameChanged", handleAiNameChange as EventListener);
    };
  }, []);

  // Load saved messages on init
  useEffect(() => {
    const savedMessages = getFromLocalStorage("chatMessages", []);
    if (savedMessages.length > 0) {
      // Convert dates from string to Date
      const messagesWithDates = savedMessages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      setLocalMessages(messagesWithDates);
    }

    // Load saved AI name
    const savedAiName = getFromLocalStorage("aiName", "Mentor Bukowski");
    setAiName(savedAiName);
  }, []);

  // Save messages when they change
  useEffect(() => {
    if (localMessages.length > 0) {
      saveToLocalStorage("chatMessages", localMessages);
    }
  }, [localMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, isLoading]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Create a new user message
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    // Update local messages
    setLocalMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    // Set loading state
    setIsLoading(true);

    try {
      // Get system prompt
      const systemPrompt = getFromLocalStorage(
        "systemPrompt",
        "You are a helpful AI assistant. Answer questions accurately and concisely.",
      );

      // Build conversation history for context
      const conversationHistory = buildConversationHistory(localMessages);

      // Check if there are knowledge files
      const hasKnowledgeFiles = getFiles().length > 0;

      // Call API with or without knowledge
      const aiResponse = hasKnowledgeFiles
        ? await callAIWithKnowledge(message, systemPrompt, conversationHistory)
        : await callAI(message, systemPrompt, conversationHistory);

      // Create a new AI message
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      // Update local messages
      setLocalMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      // Handle error
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

  // Build conversation history for context
  const buildConversationHistory = (
    messages: Message[],
  ): { role: string; content: string }[] => {
    // Get the maximum number of messages to include in context
    const maxContextMessages = getFromLocalStorage("maxContextMessages", 10);

    // Get the most recent messages up to the limit
    const recentMessages = messages.slice(-maxContextMessages);

    // Convert to the format expected by the API
    return recentMessages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
    }));
  };

  const handleClearChat = () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres borrar toda la conversación?",
      )
    ) {
      setLocalMessages([]);
      saveToLocalStorage("chatMessages", []);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center p-2 border-b w-full">
        <div className="w-24">{/* Empty div for spacing */}</div>
        <h2 className="text-lg font-medium text-center flex-1">{aiName}</h2>
        <div className="w-24 flex justify-end">
          <button
            onClick={handleClearChat}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Borrar conversación
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 w-full">
        {localMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground text-center">
              Inicia una conversación con el asistente AI
            </p>
          </div>
        ) : (
          localMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-muted mr-auto"
              } max-w-[80%]`}
            >
              <div className="font-medium mb-1">
                {msg.sender === "user" ? "Yo:" : `${aiName}:`}
              </div>
              {msg.content}
              <div className="text-xs opacity-70 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="bg-muted p-3 rounded-lg mr-auto max-w-[80%]">
            <div className="font-medium mb-1">{aiName}:</div>
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4 w-full">
        <div className="flex space-x-2 w-full">
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
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
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
