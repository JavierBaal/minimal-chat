import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface MessageListProps {
  messages?: Message[];
  className?: string;
}

const MessageList = ({
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
  className,
}: MessageListProps) => {
  // Format timestamp to readable time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={cn("w-full h-full bg-background flex flex-col", className)}>
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "flex max-w-[80%] md:max-w-[70%]",
                  message.sender === "user" ? "flex-row-reverse" : "flex-row",
                  "items-start gap-2",
                )}
              >
                {message.sender === "ai" ? (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/bottts/svg?seed=ai"
                      alt="AI"
                    />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                      alt="User"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "rounded-lg p-3",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div
                    className={cn(
                      "text-xs mt-1",
                      message.sender === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground",
                    )}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageList;
