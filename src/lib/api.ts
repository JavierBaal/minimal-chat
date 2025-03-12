import { getFromLocalStorage } from "./storage";
import { getFiles } from "./knowledgeBase";

// Function to search in past conversations
// Modify searchInMemory to use persistent storage
export const searchInMemory = async (query: string): Promise<string> => {
  // Obtener todos los mensajes pasados desde el almacenamiento persistente
  const allMessages = await getFromStorage("chatMessages", []);
  
  if (allMessages.length === 0) {
    return "No tengo conversaciones pasadas guardadas en mi memoria.";
  }
  
  // Obtener frases de búsqueda
  const searchPhrases = await getFromStorage("memorySearchPhrases", [
    "Déjame buscar en mis recuerdos...",
    "Voy a escarbar en mi memoria para encontrar eso...",
    "Recuerdo que hablamos de esto antes, permíteme buscar...",
    "Estoy consultando nuestras conversaciones anteriores...",
  ]);
  
  // Select a random phrase
  const randomPhrase = searchPhrases[Math.floor(Math.random() * searchPhrases.length)];
  
  // Simple search implementation - can be improved with more sophisticated algorithms
  const relevantMessages = allMessages.filter(msg => 
    msg.content.toLowerCase().includes(query.toLowerCase())
  );
  
  if (relevantMessages.length === 0) {
    return `${randomPhrase}\n\nNo encontré ninguna conversación pasada relacionada con "${query}".`;
  }
  
  // Format the results
  const formattedResults = relevantMessages.map(msg => {
    const date = new Date(msg.timestamp).toLocaleString();
    return `[${date}] ${msg.sender === 'user' ? 'Tú' : 'AI'}: ${msg.content}`;
  }).join('\n\n');
  
  return `${randomPhrase}\n\nEncontré estas conversaciones relacionadas con "${query}":\n\n${formattedResults}`;
};

// Function to call OpenAI API
export const callOpenAI = async (
  message: string, 
  systemPrompt: string, 
  conversationHistory: { role: string, content: string }[] = []
) => {
  const apiKey = getFromLocalStorage("apiKeys", {}).openAI;
  
  if (!apiKey) {
    throw new Error("No se ha configurado la API key de OpenAI");
  }
  
  try {
    // Prepare messages array with system prompt, conversation history, and current message
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message }
    ];
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: getFromLocalStorage("selectedModel", "gpt-3.5-turbo"),
        messages: messages,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Error al llamar a la API de OpenAI");
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error llamando a OpenAI:", error);
    throw error;
  }
};

// Function to call DeepSeek API
export const callDeepSeek = async (
  message: string, 
  systemPrompt: string, 
  conversationHistory: { role: string, content: string }[] = []
) => {
  const apiKey = getFromLocalStorage("apiKeys", {}).deepSeek;
  
  if (!apiKey) {
    throw new Error("No se ha configurado la API key de DeepSeek");
  }
  
  try {
    // Prepare messages array with system prompt, conversation history, and current message
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message }
    ];
    
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: getFromLocalStorage("selectedModel", "deepseek-chat"),
        messages: messages,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Error al llamar a la API de DeepSeek");
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error llamando a DeepSeek:", error);
    throw error;
  }
};

// Function to call the appropriate API based on the selected model
export const callAI = async (
  message: string, 
  systemPrompt: string, 
  conversationHistory: { role: string, content: string }[] = []
) => {
  // Check if the message is a memory search request
  if (message.toLowerCase().includes("recuerdas") || 
      message.toLowerCase().includes("hablamos de") ||
      message.toLowerCase().includes("mencionaste") ||
      message.toLowerCase().includes("dijiste sobre")) {
    
    // Extract the search query - this is a simple implementation
    const searchQuery = message.replace(/recuerdas|hablamos de|mencionaste|dijiste sobre/gi, "").trim();
    
    if (searchQuery) {
      // Search in memory
      return await searchInMemory(searchQuery);
    }
  }
  
  // If not a memory search, proceed with normal API call
  const selectedModel = getFromLocalStorage("selectedModel", "gpt-3.5-turbo");
  const apiKeys = getFromLocalStorage("apiKeys", {});
  
  // Check if the model is from DeepSeek
  if (selectedModel.includes("deepseek")) {
    if (!apiKeys.deepSeek) {
      throw new Error("No se ha configurado la API key de DeepSeek");
    }
    return callDeepSeek(message, systemPrompt, conversationHistory);
  } else {
    // Default to OpenAI
    if (!apiKeys.openAI) {
      throw new Error("No se ha configurado la API key de OpenAI");
    }
    return callOpenAI(message, systemPrompt, conversationHistory);
  }
};

// Function to call AI with knowledge base
export const callAIWithKnowledge = async (
  message: string, 
  systemPrompt: string, 
  conversationHistory: { role: string, content: string }[] = []
) => {
  const knowledgeFiles = getFiles();
  
  // Prepare context with file information
  let context = "";
  if (knowledgeFiles.length > 0) {
    const relevantFiles = knowledgeFiles.slice(0, 3);
    
    context = "Información de referencia:\n\n" + 
      relevantFiles.map(file => 
        `[${file.name}]:\n${file.content.substring(0, 1000)}...`
      ).join("\n\n");
  }
  
  // Prepare system prompt with context
  const fullSystemPrompt = context 
    ? `${systemPrompt}\n\nUtiliza la siguiente información como referencia para responder:\n${context}`
    : systemPrompt;
  
  // Call the appropriate API
  return callAI(message, fullSystemPrompt, conversationHistory);
};