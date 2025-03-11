import { saveToLocalStorage, getFromLocalStorage } from "./storage";

export interface KnowledgeFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  dateAdded: Date;
}

export const saveFile = async (file: File): Promise<KnowledgeFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const fileType = file.name.split('.').pop()?.toLowerCase() || '';
        
        const knowledgeFile: KnowledgeFile = {
          id: `file-${Date.now()}`,
          name: file.name,
          type: fileType,
          size: file.size,
          content,
          dateAdded: new Date()
        };
        
        // Obtén los archivos existentes
        const existingFiles = getFromLocalStorage("knowledgeFiles", []);
        
        // Añade el nuevo archivo
        const updatedFiles = [...existingFiles, knowledgeFile];
        
        // Guarda los archivos actualizados
        saveToLocalStorage("knowledgeFiles", updatedFiles);
        
        resolve(knowledgeFile);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"));
    };
    
    reader.readAsText(file);
  });
};

export const deleteFile = (fileId: string): boolean => {
  try {
    // Obtén los archivos existentes
    const existingFiles = getFromLocalStorage("knowledgeFiles", []);
    
    // Filtra el archivo a eliminar
    const updatedFiles = existingFiles.filter(
      (file: KnowledgeFile) => file.id !== fileId
    );
    
    // Guarda los archivos actualizados
    saveToLocalStorage("knowledgeFiles", updatedFiles);
    
    return true;
  } catch (error) {
    console.error("Error al eliminar el archivo:", error);
    return false;
  }
};

export const getFiles = (): KnowledgeFile[] => {
  return getFromLocalStorage("knowledgeFiles", []);
};