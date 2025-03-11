import { getFromLocalStorage } from "./storage";
import { getFiles } from "./knowledgeBase";

export const callOpenAI = async (message: string, systemPrompt: string) => {
  const apiKey = getFromLocalStorage("apiKeys", {}).openAI;
  
  if (!apiKey) {
    throw new Error("No se ha configurado la API key de OpenAI");
  }
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: getFromLocalStorage("selectedModel", "gpt-3.5-turbo"),
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
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

export const callOpenAIWithKnowledge = async (message: string, systemPrompt: string) => {
  const apiKey = getFromLocalStorage("apiKeys", {}).openAI;
  
  if (!apiKey) {
    throw new Error("No se ha configurado la API key de OpenAI");
  }
  
  // Obtén los archivos de la base de conocimiento
  const knowledgeFiles = getFiles();
  
  // Prepara el contexto con la información de los archivos
  let context = "";
  if (knowledgeFiles.length > 0) {
    // Limita la cantidad de contexto para no exceder los límites de la API
    const relevantFiles = knowledgeFiles.slice(0, 3); // Limita a 3 archivos
    
    context = "Información de referencia:\n\n" + 
      relevantFiles.map(file => 
        `[${file.name}]:\n${file.content.substring(0, 1000)}...`
      ).join("\n\n");
  }
  
  // Prepara el prompt del sistema con el contexto
  const fullSystemPrompt = context 
    ? `${systemPrompt}\n\nUtiliza la siguiente información como referencia para responder:\n${context}`
    : systemPrompt;
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: getFromLocalStorage("selectedModel", "gpt-3.5-turbo"),
        messages: [
          { role: "system", content: fullSystemPrompt },
          { role: "user", content: message }
        ],
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