import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, Plus, FileText, AlertCircle } from "lucide-react";
import FileUploader from "./FileUploader";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface KnowledgeFile {
  id: string;
  name: string;
  type: string;
  size: number;
  dateAdded: Date;
}

interface KnowledgeBaseManagerProps {
  files?: KnowledgeFile[];
  onFileUpload?: (file: File) => void;
  onFileDelete?: (fileId: string) => void;
  maxFiles?: number;
}

const KnowledgeBaseManager = ({
  files = [
    {
      id: "1",
      name: "product-documentation.pdf",
      type: "pdf",
      size: 2.4 * 1024 * 1024,
      dateAdded: new Date(2023, 5, 15),
    },
    {
      id: "2",
      name: "user-guide.md",
      type: "md",
      size: 0.8 * 1024 * 1024,
      dateAdded: new Date(2023, 6, 22),
    },
    {
      id: "3",
      name: "api-reference.txt",
      type: "txt",
      size: 0.3 * 1024 * 1024,
      dateAdded: new Date(2023, 7, 10),
    },
  ],
  onFileUpload = () => {},
  onFileDelete = () => {},
  maxFiles = 10,
}: KnowledgeBaseManagerProps) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileUpload = (file: File) => {
    // In a real implementation, this would send the file to a server
    onFileUpload(file);
    setIsUploading(false);
  };

  const handleDeleteFile = (fileId: string) => {
    onFileDelete(fileId);
  };

  const filteredFiles =
    activeTab === "all"
      ? files
      : files.filter((file) => file.type === activeTab);

  const fileTypeCount = {
    pdf: files.filter((file) => file.type === "pdf").length,
    md: files.filter((file) => file.type === "md").length,
    txt: files.filter((file) => file.type === "txt").length,
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">
              Knowledge Base
            </CardTitle>
            <CardDescription>
              Upload and manage files for AI context and reference
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="ml-2">
                  {files.length}/{maxFiles}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {files.length} of {maxFiles} files used
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isUploading ? (
          <FileUploader onFileUpload={handleFileUpload} />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">All ({files.length})</TabsTrigger>
                  <TabsTrigger value="pdf">
                    PDF ({fileTypeCount.pdf})
                  </TabsTrigger>
                  <TabsTrigger value="md">MD ({fileTypeCount.md})</TabsTrigger>
                  <TabsTrigger value="txt">
                    TXT ({fileTypeCount.txt})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {filteredFiles.length > 0 ? (
              <ScrollArea className="h-[300px] rounded-md border">
                <div className="p-4 space-y-2">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{formatDate(file.dateAdded)}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="font-medium">No files found</h3>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  {activeTab === "all"
                    ? "Upload files to your knowledge base to get started"
                    : `No ${activeTab.toUpperCase()} files found in your knowledge base`}
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={() => setIsUploading(true)}
                disabled={files.length >= maxFiles}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Upload New File
              </Button>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsUploading(false)}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseManager;
