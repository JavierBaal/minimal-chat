// At the top of the file, add these imports
import { getFromLocalStorage } from '../utils/storage';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { Message } from '../types'; // Adjust this path if your Message type is defined elsewhere

// Inside your component function, add:
const { toast } = useToast();
const [chatMessages, setChatMessages] = useState<Message[]>([]);

const handleClearChat = () => {
  const storedMemory = getFromLocalStorage("chatMessages", []);
  // Solo limpiamos los mensajes de la conversación actual
  setChatMessages([]);
  
  // Opcional: mostrar un mensaje de confirmación
  toast({
    title: "Conversación limpiada",
    description: "La conversación ha sido limpiada, pero la memoria se mantiene intacta.",
    duration: 3000,
  });
};