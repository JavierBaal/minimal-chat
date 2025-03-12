// Add this if you don't have a Message type defined
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
  // Add any other properties your messages have
}