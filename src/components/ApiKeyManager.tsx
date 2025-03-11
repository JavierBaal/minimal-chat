import React, { useState } from "react";
import { Eye, EyeOff, Info } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ApiKeyManagerProps {
  openAIKey?: string;
  deepSeekKey?: string;
  onSaveKeys?: (keys: { openAI: string; deepSeek: string }) => void;
}

const ApiKeyManager = ({
  openAIKey = "",
  deepSeekKey = "",
  onSaveKeys = () => {},
}: ApiKeyManagerProps) => {
  const [openAI, setOpenAI] = useState(openAIKey);
  const [deepSeek, setDeepSeek] = useState(deepSeekKey);
  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showDeepSeek, setShowDeepSeek] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      onSaveKeys({ openAI, deepSeek });
      setIsSaving(false);
    }, 500);
  };

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle>API Key Management</CardTitle>
        <CardDescription>
          Securely store your API keys for OpenAI and DeepSeek models.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="openai-key" className="text-sm font-medium">
              OpenAI API Key
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Get your API key from OpenAI dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="relative">
            <Input
              id="openai-key"
              type={showOpenAI ? "text" : "password"}
              placeholder="sk-..."
              value={openAI}
              onChange={(e) => setOpenAI(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowOpenAI(!showOpenAI)}
            >
              {showOpenAI ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="deepseek-key" className="text-sm font-medium">
              DeepSeek API Key
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Get your API key from DeepSeek dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="relative">
            <Input
              id="deepseek-key"
              type={showDeepSeek ? "text" : "password"}
              placeholder="ds-..."
              value={deepSeek}
              onChange={(e) => setDeepSeek(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowDeepSeek(!showDeepSeek)}
            >
              {showDeepSeek ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving} className="ml-auto">
          {isSaving ? "Saving..." : "Save Keys"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyManager;
