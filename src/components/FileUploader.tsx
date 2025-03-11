import React, { useState, useCallback } from "react";
import { FileX, Upload, Check, File } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";

interface FileUploaderProps {
  onFileUpload?: (file: File) => void;
  acceptedFileTypes?: string[];
  maxFileSizeMB?: number;
}

const FileUploader = ({
  onFileUpload = () => {},
  acceptedFileTypes = [".pdf", ".md", ".txt"],
  maxFileSizeMB = 10,
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const maxSizeBytes = maxFileSizeMB * 1024 * 1024;

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeBytes) {
      setErrorMessage(
        `File size exceeds the maximum limit of ${maxFileSizeMB}MB`,
      );
      return false;
    }

    // Check file type
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!acceptedFileTypes.includes(fileExtension)) {
      setErrorMessage(
        `File type not supported. Accepted types: ${acceptedFileTypes.join(", ")}`,
      );
      return false;
    }

    return true;
  };

  const handleFileDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setErrorMessage("");

      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile) return;

      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        simulateUpload(droppedFile);
      } else {
        setUploadStatus("error");
      }
    },
    [acceptedFileTypes, maxSizeBytes],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setErrorMessage("");
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return;

      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        simulateUpload(selectedFile);
      } else {
        setUploadStatus("error");
      }
    },
    [acceptedFileTypes, maxSizeBytes],
  );

  const simulateUpload = (file: File) => {
    setUploadStatus("uploading");
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus("success");
          onFileUpload(file);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus("idle");
    setErrorMessage("");
  };

  return (
    <div className="w-full bg-background p-4 rounded-lg border border-border">
      {uploadStatus === "idle" || uploadStatus === "error" ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"} ${uploadStatus === "error" ? "border-destructive/50 bg-destructive/5" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleFileDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-foreground">
                Drag & Drop your file here
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Supports {acceptedFileTypes.join(", ")} files up to{" "}
                {maxFileSizeMB}MB
              </p>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Browse Files
              </Button>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileInput}
                accept={acceptedFileTypes.join(",")}
              />
            </div>
          </div>

          {errorMessage && (
            <div className="absolute bottom-2 left-0 right-0 bg-destructive/10 text-destructive text-sm p-2 rounded flex items-center justify-center">
              <FileX className="h-4 w-4 mr-2" />
              {errorMessage}
            </div>
          )}
        </div>
      ) : (
        <div className="border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-md bg-primary/10">
              <File className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file?.name}</p>
              <p className="text-xs text-muted-foreground">
                {file?.size ? (file.size / 1024 / 1024).toFixed(2) : "0"} MB
              </p>
            </div>
            {uploadStatus === "success" ? (
              <div className="p-1 rounded-full bg-green-100">
                <Check className="h-4 w-4 text-green-600" />
              </div>
            ) : null}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-1.5" />
          </div>

          {uploadStatus === "success" && (
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={resetUpload}>
                Upload Another File
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
