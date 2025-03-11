import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";

interface ChatLayoutProps {
  className?: string;
}

const ChatLayout = ({ className }: ChatLayoutProps) => {
  const [isPinSetup, setIsPinSetup] = useState(false);

  useEffect(() => {
    // Check if user has previously set up the application
    const hasSetupPin = localStorage.getItem("hasSetupPin");
    if (hasSetupPin) {
      setIsPinSetup(true);
    }
  }, []);

  const handleSetupPin = (pin: string) => {
    // In a real app, this would securely store the PIN
    console.log("PIN setup:", pin);
    setIsPinSetup(true);
    localStorage.setItem("hasSetupPin", "true");
  };

  return (
    <div className={cn("h-full w-full bg-background", className)}>
      {/* Sidebar with settings icon */}
      <Sidebar isPinSetup={isPinSetup} onSetupPin={handleSetupPin} />

      {/* Chat Area */}
      <div className="h-full w-full">
        <ChatArea />
      </div>
    </div>
  );
};

export default ChatLayout;
