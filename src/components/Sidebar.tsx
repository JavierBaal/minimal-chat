import React, { useState, useEffect } from "react";
import { Settings, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import ConfigPanel from "./ConfigPanel";
import PinDialog from "./PinDialog";
import ThemeToggle from "./ThemeToggle";
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/storage";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "./ui/textarea";

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
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!getFromLocalStorage("securePin", ""),
  );
  const [storedPin, setStoredPin] = useState(
    getFromLocalStorage("securePin", ""),
  );
  const [theme, setTheme] = useState<"light" | "dark">(
    getFromLocalStorage("theme", "light"),
  );
  const [apiKeys, setApiKeys] = useState(
    getFromLocalStorage("apiKeys", { openAI: "", deepSeek: "" }),
  );
  const [selectedModel, setSelectedModel] = useState(
    getFromLocalStorage("selectedModel", "gpt-4o"),
  );
  const [systemPrompt, setSystemPrompt] = useState(
    getFromLocalStorage(
      "systemPrompt",
      "You are a helpful AI assistant. Answer questions accurately and concisely.",
    ),
  );
  // Add the maxContextMessages state
  const [maxContextMessages, setMaxContextMessages] = useState(
    getFromLocalStorage("maxContextMessages", 10),
  );

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    saveToLocalStorage("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Carga las configuraciones al inicio
  useEffect(() => {
    // Aplica el tema
    document.documentElement.classList.toggle("dark", theme === "dark");

    // Load saved context size
    const savedMaxContextMessages = getFromLocalStorage(
      "maxContextMessages",
      10,
    );
    setMaxContextMessages(savedMaxContextMessages);
  }, [theme]);

  const handleApiKeysChange = (keys: { openAI: string; deepSeek: string }) => {
    setApiKeys(keys);
    saveToLocalStorage("apiKeys", keys);
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    saveToLocalStorage("selectedModel", modelId);
  };

  const handleSystemPromptChange = (prompt: string) => {
    setSystemPrompt(prompt);
    saveToLocalStorage("systemPrompt", prompt);
  };

  // Add the handler for context size changes
  const handleMaxContextMessagesChange = (value: number[]) => {
    const newValue = value[0];
    setMaxContextMessages(newValue);
    saveToLocalStorage("maxContextMessages", newValue);
  };

  const handleFileUpload = (file: File) => {
    // In a real implementation, this would process and store the file
    console.log("File uploaded:", file.name);
  };

  const handleSettingsClick = () => {
    // Si el PIN está configurado pero no autenticado, pedir PIN
    if (isPinSetup && !isAuthenticated) {
      setShowPinDialog(true);
    } else if (!isPinSetup) {
      // Si no hay PIN configurado, mostrar diálogo para configurarlo
      setShowPinDialog(true);
    } else {
      // Si ya está autenticado, mostrar panel directamente
      setShowConfigPanel(true);
    }
  };

  const handlePinSubmit = (pin: string) => {
    if (!isPinSetup) {
      // Guarda el PIN con un hash simple (en producción usa bcrypt)
      const hashedPin = btoa(pin); // Codificación básica, no segura para producción
      saveToLocalStorage("securePin", hashedPin);
      setStoredPin(hashedPin);
      onSetupPin(pin);
      setIsAuthenticated(true);
      setShowPinDialog(false);
      setShowConfigPanel(true);
    } else {
      // Verifica el PIN
      const hashedPin = btoa(pin);
      if (hashedPin === storedPin) {
        setIsAuthenticated(true);
        setShowPinDialog(false);
        setShowConfigPanel(true);
      } else {
        alert("PIN incorrecto. Inténtalo de nuevo.");
      }
    }
  };

  const handleCloseConfig = () => {
    setShowConfigPanel(false);
  };

  // Add state for AI name
  const [aiName, setAiName] = useState(
    getFromLocalStorage("aiName", "Mentor Bukowski"),
  );

  // Add state for memory search phrases
  const [memorySearchPhrases, setMemorySearchPhrases] = useState<string[]>(
    getFromLocalStorage("memorySearchPhrases", [
      "Déjame buscar en mis recuerdos...",
      "Voy a escarbar en mi memoria para encontrar eso...",
      "Recuerdo que hablamos de esto antes, permíteme buscar...",
      "Estoy consultando nuestras conversaciones anteriores...",
      "Dame un momento para recordar nuestra charla sobre ese tema...",
    ]),
  );

  // Add handler for AI name change
  // In the Sidebar component where the AI name is changed
  const handleAiNameChange = (name: string) => {
    setAiName(name);
    saveToLocalStorage("aiName", name);
    
    // Dispatch a custom event to notify other components
    const event = new CustomEvent("aiNameChanged", { detail: name });
    window.dispatchEvent(event);
  };

  // Add handler for memory search phrases
  const handleMemorySearchPhrasesChange = (phrases: string) => {
    const phrasesArray = phrases
      .split("\n")
      .map((phrase) => phrase.trim())
      .filter((phrase) => phrase.length > 0);

    setMemorySearchPhrases(phrasesArray);
    saveToLocalStorage("memorySearchPhrases", phrasesArray);
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
                <h2 className="text-lg font-medium">Panel de Configuración</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Tema</span>
                  <ThemeToggle
                    theme={theme}
                    onThemeChange={handleThemeChange}
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleCloseConfig}>
                  Cerrar
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
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

              {/* Add the context size slider */}
              <div className="mt-6 space-y-2">
                <label className="text-sm font-medium">
                  Tamaño de la ventana de contexto
                </label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[maxContextMessages]}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={handleMaxContextMessagesChange}
                  />
                  <span className="text-sm">{maxContextMessages} mensajes</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Número de mensajes anteriores que se incluirán como contexto
                  para la IA
                </p>
              </div>

              {/* AI Name Configuration */}
              <div className="mt-6 space-y-2">
                <label className="text-sm font-medium">Nombre de la IA</label>
                <input
                  type="text"
                  value={aiName}
                  onChange={(e) => handleAiNameChange(e.target.value)}
                  placeholder="Nombre de la IA"
                  className="w-full p-2 border rounded-md"
                />
                <p className="text-xs text-muted-foreground">
                  Este nombre se mostrará en las respuestas de la IA
                </p>
              </div>

              {/* Memory search phrases */}
              <div className="mt-6 space-y-2">
                <label className="text-sm font-medium">
                  Frases para búsqueda en memoria
                </label>
                <Textarea
                  value={memorySearchPhrases.join("\n")}
                  onChange={(e) =>
                    handleMemorySearchPhrasesChange(e.target.value)
                  }
                  placeholder="Ingresa frases que la IA usará cuando busque en su memoria..."
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  Ingresa una frase por línea. La IA seleccionará aleatoriamente
                  una de estas frases cuando busque en conversaciones pasadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;


// In the Sidebar component, update the PIN handling logic

// Make sure you have these state variables at the top of your component
const [pin, setPin] = useState(getFromLocalStorage("settingsPin", ""));
const [pinInput, setPinInput] = useState("");
const [isPinSet, setIsPinSet] = useState(Boolean(getFromLocalStorage("settingsPin", "")));
const [showPinDialog, setShowPinDialog] = useState(false);

// Update the function that handles settings button click
const handleSettingsClick = () => {
  const savedPin = getFromLocalStorage("settingsPin", "");
  
  if (savedPin) {
    // If PIN exists, show PIN verification dialog
    setShowPinDialog(true);
    setShowSettings(false);
  } else {
    // If no PIN exists, show settings directly
    setShowSettings(true);
    setShowPinDialog(false);
  }
};

// Update the function that handles PIN verification
const handleVerifyPin = () => {
  const savedPin = getFromLocalStorage("settingsPin", "");
  
  if (pinInput === savedPin) {
    // PIN is correct, show settings
    setShowSettings(true);
    setShowPinDialog(false);
    setPinInput("");
  } else {
    // PIN is incorrect
    alert("PIN incorrecto");
  }
};

// Update the function that handles setting a new PIN
const handleSetPin = () => {
  if (pinInput.trim()) {
    saveToLocalStorage("settingsPin", pinInput);
    setPin(pinInput);
    setIsPinSet(true);
    setPinInput("");
    // Close PIN dialog if it's open
    setShowPinDialog(false);
  }
};

// Make sure your PIN dialog UI checks isPinSet to determine whether to show
// "Set PIN" or "Enter PIN" UI
