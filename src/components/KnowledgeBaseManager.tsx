import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { saveFile, deleteFile, getFiles, KnowledgeFile } from "@/lib/knowledgeBase";

interface KnowledgeBaseManagerProps {
  onFileChange?: () => void;
}

const KnowledgeBaseManager: React.FC<KnowledgeBaseManagerProps> = ({ onFileChange }) => {
  const [files, setFiles] = useState<KnowledgeFile[]>(getFiles());
  const [isUploading, setIsUploading] = useState(false);

  // Actualiza la lista de archivos cuando cambian
  useEffect(() => {
    setFiles(getFiles());
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    
    try {
      const file = fileList[0];
      await saveFile(file);
      setFiles(getFiles());
      if (onFileChange) onFileChange();
    } catch (error: any) {
      console.error("Error al subir el archivo:", error);
      alert("Error al subir el archivo: " + error.message);
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = "";
    }
  };

  const handleDeleteFile = (fileId: string) => {
    if (deleteFile(fileId)) {
      setFiles(getFiles());
      if (onFileChange) onFileChange();
    } else {
      alert("Error al eliminar el archivo");
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Base de Conocimiento</CardTitle>
        <CardDescription>
          Sube archivos de texto para que el AI pueda utilizarlos como referencia.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
              disabled={isUploading}
            >
              {isUploading ? "Subiendo..." : "Subir Archivo"}
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".txt,.md,.csv,.json"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <span className="text-sm text-muted-foreground">
              Formatos soportados: .txt, .md, .csv, .json
            </span>
          </div>

          {files.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Archivos Subidos</h3>
              <div className="rounded-md border">
                {files.map((file) => (
                  <div key={file.id}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} • {new Date(file.dateAdded).toLocaleString()}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  No hay archivos subidos
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Los archivos subidos se utilizarán como contexto para las respuestas del AI
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseManager;
