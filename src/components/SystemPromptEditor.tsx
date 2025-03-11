import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Eye, Save, RefreshCw } from "lucide-react";

interface SystemPromptEditorProps {
  initialPrompt?: string;
  onSave?: (prompt: string) => void;
  previewEnabled?: boolean;
}

const SystemPromptEditor = ({
  initialPrompt = "You are a helpful AI assistant. Answer questions accurately and concisely.",
  onSave = () => {},
  previewEnabled = true,
}: SystemPromptEditorProps) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      onSave(prompt);
      setIsSaving(false);
    }, 500);
  };

  const handleReset = () => {
    setPrompt(initialPrompt);
  };

  return (
    <Card className="w-full bg-background border-border">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          System Prompt Editor
        </CardTitle>
        <CardDescription>
          Customize the AI's behavior by editing the system prompt below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview" disabled={!previewEnabled}>
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter system prompt here..."
              className="min-h-[150px] font-mono text-sm"
            />
            <div className="text-xs text-muted-foreground">
              <p>Tips:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Be specific about the AI's role and tone</li>
                <li>Include constraints and limitations</li>
                <li>Define the format for responses if needed</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="bg-muted p-4 rounded-md min-h-[150px] whitespace-pre-wrap text-sm">
              {prompt || "No prompt provided"}
            </div>
            <div className="text-xs text-muted-foreground italic">
              This is how your system prompt will be interpreted by the AI
              model.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          {previewEnabled && activeTab === "edit" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setActiveTab("preview")}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          )}
        </div>
        <Button onClick={handleSave} disabled={isSaving} size="sm">
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SystemPromptEditor;
