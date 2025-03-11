import React, { useState } from "react";
import { Key, MessageSquare, Database } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import ApiKeyManager from "./ApiKeyManager";
import ModelSelector from "./ModelSelector";
import SystemPromptEditor from "./SystemPromptEditor";
import KnowledgeBaseManager from "./KnowledgeBaseManager";
import { Separator } from "./ui/separator";

interface ConfigPanelProps {
  isAuthenticated?: boolean;
  onAuthenticate?: (pin: string) => void;
  onSetupPin?: (pin: string) => void;
  isPinSetup?: boolean;
  apiKeys?: {
    openAI: string;
    deepSeek: string;
  };
  selectedModel?: string;
  systemPrompt?: string;
  onApiKeysChange?: (keys: { openAI: string; deepSeek: string }) => void;
  onModelChange?: (modelId: string) => void;
  onSystemPromptChange?: (prompt: string) => void;
  onFileUpload?: (file: File) => void;
}

const ConfigPanel = ({
  apiKeys = { openAI: "", deepSeek: "" },
  selectedModel = "gpt-4o",
  systemPrompt = "You are a helpful AI assistant. Answer questions accurately and concisely.",
  onApiKeysChange = () => {},
  onModelChange = () => {},
  onSystemPromptChange = () => {},
  onFileUpload = () => {},
}: ConfigPanelProps) => {
  const [activeTab, setActiveTab] = useState("api-keys");

  return (
    <div className="w-full bg-background flex flex-col p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 sticky top-0 bg-background z-10">
          <TabsTrigger value="api-keys" className="flex items-center">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="model-settings" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Model Settings
          </TabsTrigger>
          <TabsTrigger value="knowledge-base" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Knowledge Base
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-6">
          <ApiKeyManager
            openAIKey={apiKeys.openAI}
            deepSeekKey={apiKeys.deepSeek}
            onSaveKeys={onApiKeysChange}
          />
        </TabsContent>

        <TabsContent value="model-settings" className="space-y-6">
          <div className="grid gap-6">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={onModelChange}
            />
            <Separator />
            <SystemPromptEditor
              initialPrompt={systemPrompt}
              onSave={onSystemPromptChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="knowledge-base" className="space-y-6">
          <KnowledgeBaseManager onFileDelete={() => {}} />
        </TabsContent>
      </Tabs>

      <div className="pt-6 pb-2 text-xs text-muted-foreground">
        <p>All configuration changes are saved automatically and securely.</p>
      </div>
    </div>
  );
};

export default ConfigPanel;
