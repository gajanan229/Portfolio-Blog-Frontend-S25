import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import type { ChatMessage } from '../../types';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';
if (!BASE_URL) {
    console.warn("VITE_BASE_URL environment variable not set, using default: http://localhost:5000");
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const threadId = useRef<string | undefined>(undefined);
  const [runId, setRunId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat thread
    createThread().catch((err) => {
      console.error("Failed to create message thread.", err);
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Poll for new messages while a run is active
  useEffect(() => {
    if (runId === undefined) return;
    const timer = setInterval(() => {
      updateMessages().catch(console.error);
    }, 1000);
    return () => clearInterval(timer);
  }, [runId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Creates or reuses a chat thread
  const createThread = async () => {
    if (!threadId.current) {
      const storedThreadId = localStorage.getItem("chatThreadId");
      if (storedThreadId) {
        threadId.current = storedThreadId;
        await updateMessages();
        return;
      }
    }
    if (threadId.current) return;

    try {
      const response = await fetch(`${BASE_URL}/chat/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const data = await response.json();
        threadId.current = data.threadId;
        localStorage.setItem("chatThreadId", threadId.current!);
        
        // Add welcome message for new sessions
        setMessages([{
          id: '1',
          text: 'Hi! I\'m Gajanan\'s AI assistant. I can help you learn more about his work, skills, and experience. What would you like to know?',
          sender: 'bot',
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error('Failed to create thread:', error);
      // Add welcome message even if thread creation fails
      setMessages([{
        id: '1',
        text: 'Hi! I\'m Gajanan\'s AI assistant. I can help you learn more about his work, skills, and experience. What would you like to know?',
        sender: 'bot',
        timestamp: new Date(),
      }]);
    }
  };

  // Parse content from OpenAI response format
  const parseContent = (content: unknown): string => {
    let text: string;
    if (typeof content === "string") {
      text = content;
    } else if (content && typeof content === "object") {
      if (Array.isArray(content) && content[0]?.text?.value) {
        text = content[0].text.value;
      } else {
        text = JSON.stringify(content);
      }
    } else {
      text = String(content);
    }
    
    // Remove unwanted patterns
    text = text.replace(/【\d+:\d+†source】/g, "");
    
    return text;
  };

  // Update messages from backend
  const updateMessages = async () => {
    if (!threadId.current) return;

    try {
      const response = await fetch(`${BASE_URL}/chat/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: threadId.current,
          runId,
        }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const msgs = data.messages.reverse();
        
        // Convert backend messages to our ChatMessage format
        const formattedMessages: ChatMessage[] = msgs.map((msg: { id?: string; content: unknown; role: string; created_at?: string }, index: number) => ({
          id: `${msg.id || index}`,
          text: parseContent(msg.content),
          sender: msg.role === 'user' ? 'user' : 'bot',
          timestamp: new Date(msg.created_at || Date.now()),
        }));

        setMessages(formattedMessages);

        if (runId && data.status === "completed") {
          setRunId(undefined);
          setIsTyping(false);
        }
      }
    } catch (error) {
      console.error('Failed to update messages:', error);
      setIsTyping(false);
    }
  };

  // Send message to backend
  const sendMessageToBackend = async (text: string) => {
    if (!threadId.current || runId) return;

    try {
      const response = await fetch(`${BASE_URL}/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: threadId.current,
          text,
        }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setRunId(data.runId);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !threadId.current) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    // Show user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      await sendMessageToBackend(userMessage.text);
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);
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
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-full shadow-lg flex items-center justify-center text-white"
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
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
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
            className="fixed bottom-16 right-2 left-2 sm:bottom-24 sm:right-6 sm:left-auto z-40 sm:w-96 h-[500px] max-w-md sm:max-w-none mx-auto sm:mx-0"
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
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
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
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 shadow-inner shadow-black/20 text-sm"
                      />
                    </div>
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