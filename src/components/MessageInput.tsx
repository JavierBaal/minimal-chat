import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send, Paperclip, Mic, Smile } from "lucide-react";

interface MessageInputProps {
  onSendMessage?: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  allowAttachments?: boolean;
  allowVoice?: boolean;
  allowEmoji?: boolean;
}

const MessageInput = ({
  onSendMessage = () => {},
  placeholder = "Type your message here...",
  disabled = false,
  allowAttachments = true,
  allowVoice = true,
  allowEmoji = true,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "40px";
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  return (
    <div className="w-full border-t border-border bg-background p-4">
      <div className="flex items-end gap-2 rounded-lg border border-input bg-background p-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[40px] max-h-[120px] border-0 focus-visible:ring-0 resize-none py-2 px-3"
        />

        <div className="flex items-center gap-1.5">
          {allowAttachments && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              disabled={disabled}
              title="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          )}

          {allowVoice && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              disabled={disabled}
              title="Voice message"
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}

          {allowEmoji && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              disabled={disabled}
              title="Add emoji"
            >
              <Smile className="h-4 w-4" />
            </Button>
          )}

          <Button
            type="button"
            size="icon"
            disabled={!isTyping || disabled}
            onClick={handleSendMessage}
            className="h-8 w-8 rounded-full"
            title="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-1 text-xs text-muted-foreground text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};

export default MessageInput;
