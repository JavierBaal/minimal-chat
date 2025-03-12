// Crear un nuevo archivo para manejar el almacenamiento

// Verificar si estamos en Electron
// Add this at the top of the file
declare global {
  interface Window {
    electron?: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
  }
}

// Then modify the isElectron function
const isElectron = () => {
  return typeof window !== 'undefined' && window.electron !== undefined;
};

// Función para obtener datos del almacenamiento
export const getFromStorage = async (key: string, defaultValue: any) => {
  if (isElectron()) {
    // Usar IPC para obtener datos del sistema de archivos
    try {
      // @ts-ignore - Electron API
      const data = await window.electron.invoke('getData', key, defaultValue);
      return data;
    } catch (error) {
      console.error(`Error getting data for ${key}:`, error);
      return defaultValue;
    }
  } else {
    // Fallback a localStorage para desarrollo web
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error parsing localStorage for ${key}:`, error);
      return defaultValue;
    }
  }
};

// Función para guardar datos en el almacenamiento
export const saveToStorage = async (key: string, value: any) => {
  if (isElectron()) {
    // Usar IPC para guardar datos en el sistema de archivos
    try {
      // @ts-ignore - Electron API
      await window.electron.invoke('saveData', key, value);
      return true;
    } catch (error) {
      console.error(`Error saving data for ${key}:`, error);
      return false;
    }
  } else {
    // Fallback a localStorage para desarrollo web
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage for ${key}:`, error);
      return false;
    }
  }
};

// Funciones de compatibilidad con las existentes
export const getFromLocalStorage = (key: string, defaultValue: any) => {
  // Para mantener compatibilidad con el código existente, hacemos una llamada síncrona
  if (isElectron()) {
    try {
      // Intentamos obtener del localStorage primero (para desarrollo)
      const item = localStorage.getItem(key);
      if (item) return JSON.parse(item);
      
      // Si no está en localStorage, devolvemos el valor por defecto
      // En producción, esto se actualizará después con getFromStorage
      return defaultValue;
    } catch (error) {
      return defaultValue;
    }
  } else {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  }
};

export const saveToLocalStorage = (key: string, value: any) => {
  // Para mantener compatibilidad con el código existente
  localStorage.setItem(key, JSON.stringify(value));
  
  // Si estamos en Electron, también guardamos en el sistema de archivos
  if (isElectron()) {
    saveToStorage(key, value).catch(error => {
      console.error(`Error saving to storage: ${error}`);
    });
  }
};

// Inicializar: cargar datos del sistema de archivos al localStorage al inicio
export const initStorage = async () => {
  if (isElectron()) {
    const keys = [
      "apiKeys",
      "selectedModel",
      "systemPrompt",
      "maxContextMessages",
      "aiName",
      "memorySearchPhrases",
      "theme",
      "chatMessages",
      "pin"
    ];
    
    for (const key of keys) {
      try {
        // @ts-ignore - Electron API
        const data = await window.electron.invoke('getData', key, null);
        if (data !== null) {
          localStorage.setItem(key, JSON.stringify(data));
        }
      } catch (error) {
        console.error(`Error initializing storage for ${key}:`, error);
      }
    }
  }
};