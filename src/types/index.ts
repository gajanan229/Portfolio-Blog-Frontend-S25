export interface User {
  id: string;
  email: string;
  isadmin: boolean;
}

export interface Project {
  id: number;
  name: string;
  type: string;
  image: string;
  rank?: number;
  year?: number;
  languages?: string;
  description?: string;
  github?: string;
  images?: string[];
  complexity?: string;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  date_range: string;
  details: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatThread {
  threadId: string;
  messages: ChatMessage[];
}