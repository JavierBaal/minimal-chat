import React, { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { cn } from "../lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatAreaProps {
  className?: string;
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

const ChatArea = ({
  className,
  messages = [
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      content:
        "I need help setting up my configuration for the chat application.",
      sender: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
    },
    {
      id: "3",
      content:
        "Sure! You can access the configuration panel from the sidebar. You'll need to set up a 6-digit PIN first to secure your settings. Would you like me to guide you through the process?",
      sender: "ai",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: "4",
      content:
        "Yes, please show me how to set up the PIN and configure my API keys.",
      sender: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
    },
    {
      id: "5",
      content:
        "To set up your PIN, click on the settings icon in the sidebar. You'll be prompted to create a 6-digit PIN. After that, you can enter your OpenAI and DeepSeek API keys in the configuration panel. You can also customize the system prompt and upload knowledge base files for better context-aware responses.",
      sender: "ai",
      timestamp: new Date(Date.now() - 1000 * 60 * 1),
    },
  ],
  onSendMessage = () => {},
  isLoading = false,
}: ChatAreaProps) => {
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);

  const handleSendMessage = (message: string) => {
    // Create a new message object
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    // Update local messages state
    setLocalMessages((prev) => [...prev, newMessage]);

    // Call the parent handler
    onSendMessage(message);

    // Simulate AI response if no handler is provided
    if (onSendMessage === ChatArea.defaultProps?.onSendMessage) {
      setTimeout(() => {
        const aiResponse: Message = {
          id: `ai-${Date.now()}`,
          content:
            "I'm a simulated AI response. In a real application, this would be replaced with an actual API call to an AI service.",
          sender: "ai",
          timestamp: new Date(),
        };
        setLocalMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <div className={cn("flex flex-col h-full w-full bg-background", className)}>
      <div className="flex-1 overflow-hidden">
        <MessageList messages={localMessages} />
      </div>
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder={
          isLoading ? "AI is thinking..." : "Type your message here..."
        }
      />
    </div>
  );
};

// Define default props to allow for the simulated response
ChatArea.defaultProps = {
  onSendMessage: () => {},
};

export default ChatArea;
