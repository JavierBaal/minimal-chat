import React, { useState } from "react";
import { Settings, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import ConfigPanel from "./ConfigPanel";
import PinDialog from "./PinDialog";
import ThemeToggle from "./ThemeToggle";

interface SidebarProps {
  isPinSetup?: boolean;
  onSetupPin?: (pin: string) => void;
}

const Sidebar = ({
  isPinSetup = false,
  onSetupPin = () => {},
}: SidebarProps) => {
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [apiKeys, setApiKeys] = useState({ openAI: "", deepSeek: "" });
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI assistant. Answer questions accurately and concisely.",
  );

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    // In a real app, you would apply the theme to the document or use a theme context
  };

  const handleApiKeysChange = (keys: { openAI: string; deepSeek: string }) => {
    setApiKeys(keys);
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleSystemPromptChange = (prompt: string) => {
    setSystemPrompt(prompt);
  };

  const handleFileUpload = (file: File) => {
    // In a real implementation, this would process and store the file
    console.log("File uploaded:", file.name);
  };

  const handleSettingsClick = () => {
    if (!isPinSetup || !isAuthenticated) {
      setShowPinDialog(true);
    } else {
      setShowConfigPanel(true);
    }
  };

  const handlePinSubmit = (pin: string) => {
    if (!isPinSetup) {
      onSetupPin(pin);
      localStorage.setItem("hasSetupPin", "true");
    }
    setIsAuthenticated(true);
    setShowPinDialog(false);
    setShowConfigPanel(true);
  };

  const handleCloseConfig = () => {
    setShowConfigPanel(false);
  };

  return (
    <>
      {/* Small settings icon */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-background shadow-md border border-border hover:bg-muted"
          onClick={handleSettingsClick}
        >
          <Settings className="h-5 w-5 text-primary" />
        </Button>
      </div>

      {/* PIN Dialog */}
      {showPinDialog && (
        <PinDialog
          isOpen={showPinDialog}
          onClose={() => setShowPinDialog(false)}
          onPinSubmit={handlePinSubmit}
          isSetup={!isPinSetup}
        />
      )}

      {/* Config Panel Overlay */}
      {showConfigPanel && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl max-h-[90vh] bg-background rounded-lg shadow-lg border border-border overflow-hidden flex flex-col my-auto">
            <div className="p-4 flex items-center justify-between border-b sticky top-0 bg-background z-10">
              <div className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-lg font-medium">Configuration Panel</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle
                    theme={theme}
                    onThemeChange={handleThemeChange}
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleCloseConfig}>
                  Close
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ConfigPanel
                isPinSetup={isPinSetup}
                isAuthenticated={isAuthenticated}
                onAuthenticate={handlePinSubmit}
                onSetupPin={onSetupPin}
                apiKeys={apiKeys}
                selectedModel={selectedModel}
                systemPrompt={systemPrompt}
                onApiKeysChange={handleApiKeysChange}
                onModelChange={handleModelChange}
                onSystemPromptChange={handleSystemPromptChange}
                onFileUpload={handleFileUpload}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
