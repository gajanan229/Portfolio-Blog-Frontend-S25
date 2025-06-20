import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { NeumorphicInput } from '../ui/NeumorphicInput';
import type { ChatMessage } from '../../types';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! I\'m Gajanan\'s AI assistant. I can help you learn more about his work, skills, and experience. What would you like to know?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat thread
    const storedThreadId = localStorage.getItem('chatThreadId');
    if (storedThreadId) {
      setThreadId(storedThreadId);
    } else {
      initializeChat();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    try {
      const response = await fetch('/chat/new', { method: 'POST' });
      if (response.ok) {
        const { threadId: newThreadId } = await response.json();
        setThreadId(newThreadId);
        localStorage.setItem('chatThreadId', newThreadId);
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      // Mock thread ID for demo
      const mockThreadId = 'thread_' + Date.now();
      setThreadId(mockThreadId);
      localStorage.setItem('chatThreadId', mockThreadId);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !threadId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, text: inputValue }),
      });

      if (response.ok) {
        const { runId } = await response.json();
        pollForResponse(runId);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Mock response for demo
      setTimeout(() => {
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(inputValue),
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const pollForResponse = async (runId: string) => {
    try {
      const response = await fetch('/chat/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, runId }),
      });

      if (response.ok) {
        const { messages: chatMessages, status } = await response.json();
        
        if (status === 'completed' && chatMessages.length > 0) {
          const botMessage = chatMessages[chatMessages.length - 1];
          const newMessage: ChatMessage = {
            id: Date.now().toString(),
            text: botMessage.content,
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, newMessage]);
          setIsTyping(false);
        } else if (status !== 'completed') {
          // Continue polling
          setTimeout(() => pollForResponse(runId), 1000);
        }
      }
    } catch (error) {
      console.error('Failed to poll for response:', error);
      setIsTyping(false);
    }
  };

  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('skill') || lowerInput.includes('technology')) {
      return "Gajanan is proficient in React, TypeScript, Node.js, Python, AWS, Docker, GraphQL, PostgreSQL, TensorFlow, and Blockchain technologies. He's particularly passionate about AI and full-stack development.";
    } else if (lowerInput.includes('experience') || lowerInput.includes('work')) {
      return "Gajanan has over 6 years of experience as a full-stack developer. He's currently a Senior Full Stack Developer at TechCorp Innovation, where he leads development of microservices serving 1M+ users and implements AI-driven features.";
    } else if (lowerInput.includes('project')) {
      return "Some of Gajanan's notable projects include an AI-Powered Analytics Dashboard, a Blockchain Voting System, and a Real-time Collaboration Tool. Each project showcases his expertise in different areas of technology.";
    } else if (lowerInput.includes('contact') || lowerInput.includes('reach')) {
      return "You can contact Gajanan at gajanan@example.com or through the contact form on this website. He's always open to discussing new opportunities and innovative projects!";
    } else {
      return "Thanks for your question! Gajanan is a passionate full-stack developer and AI innovator with expertise in modern web technologies. Feel free to ask about his skills, experience, or projects. Is there something specific you'd like to know?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-full shadow-lg flex items-center justify-center text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: [
            '0 0 20px rgba(99, 102, 241, 0.3)',
            '0 0 30px rgba(236, 72, 153, 0.4)',
            '0 0 20px rgba(99, 102, 241, 0.3)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[500px]"
          >
            <GlassCard className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Assistant</h3>
                    <p className="text-xs text-gray-400">Ask me about Gajanan</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white/10 text-gray-200'
                    }`}>
                      <div className="flex items-start space-x-2">
                        {message.sender === 'bot' && (
                          <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        {message.sender === 'user' && (
                          <User className="w-4 h-4 mt-0.5 flex-shrink-0 order-last" />
                        )}
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/10 p-3 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <NeumorphicInput
                      placeholder="Type your message..."
                      value={inputValue}
                      onChange={setInputValue}
                      className="text-sm"
                    />
                  </div>
                  <motion.button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};