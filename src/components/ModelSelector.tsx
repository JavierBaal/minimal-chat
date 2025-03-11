import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ModelOption {
  id: string;
  name: string;
  provider: "OpenAI" | "DeepSeek";
  description: string;
}

interface ModelSelectorProps {
  selectedModel?: string;
  onModelChange?: (modelId: string) => void;
  disabled?: boolean;
}

const ModelSelector = ({
  selectedModel = "gpt-4o",
  onModelChange = () => {},
  disabled = false,
}: ModelSelectorProps) => {
  // Default model options
  const modelOptions: ModelOption[] = [
    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "OpenAI",
      description: "Most capable model for complex tasks",
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      provider: "OpenAI",
      description: "Fast and efficient for most tasks",
    },
    {
      id: "deepseek-chat",
      name: "DeepSeek Chat",
      provider: "DeepSeek",
      description: "General purpose chat model",
    },
    {
      id: "deepseek-coder",
      name: "DeepSeek Coder",
      provider: "DeepSeek",
      description: "Specialized for code generation and analysis",
    },
  ];

  const [selectedModelDetails, setSelectedModelDetails] = useState<
    ModelOption | undefined
  >(modelOptions.find((model) => model.id === selectedModel));

  const handleModelChange = (modelId: string) => {
    const model = modelOptions.find((m) => m.id === modelId);
    setSelectedModelDetails(model);
    onModelChange(modelId);
  };

  return (
    <Card className="w-full bg-card border rounded-md shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Model Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select
            value={selectedModel}
            onValueChange={handleModelChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>OpenAI Models</SelectLabel>
                {modelOptions
                  .filter((model) => model.provider === "OpenAI")
                  .map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>DeepSeek Models</SelectLabel>
                {modelOptions
                  .filter((model) => model.provider === "DeepSeek")
                  .map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {selectedModelDetails && (
            <div className="pt-2 text-sm">
              <p className="font-medium">{selectedModelDetails.name}</p>
              <p className="text-muted-foreground">
                {selectedModelDetails.description}
              </p>
              <div className="mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {selectedModelDetails.provider}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelSelector;
