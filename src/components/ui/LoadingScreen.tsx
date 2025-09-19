import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  isAuthenticating?: boolean;
}

const MatrixBackground: React.FC = () => {
  const matrixChars = '01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101';
  
  // Memoize matrix columns to prevent regeneration on re-renders
  const matrixColumns = useMemo(() => Array.from({ length: 25 }, (_, colIndex) => ({
    id: colIndex,
    chars: Array.from({ length: 15 }, () => matrixChars[Math.floor(Math.random() * matrixChars.length)]),
    animationDelay: Math.random() * 0.5,
    animationDuration: 4 + Math.random() * 4
  })), []);

  return (
    <>
      <div className="fixed inset-0 z-0 opacity-30">
        {matrixColumns.map((column) => (
          <div
            key={column.id}
            className="absolute top-0 text-green-400 text-lg font-mono tracking-wider animate-matrix-fall"
            style={{ 
              left: `${(column.id / matrixColumns.length) * 100}%`,
              animationDelay: `${column.animationDelay}s`,
              animationDuration: `${column.animationDuration}s`,
              fontFamily: 'Courier New, monospace',
              fontWeight: 'bold'
            }}
          >
            {column.chars.map((char, charIndex) => (
              <div
                key={charIndex}
                className="opacity-60 mb-4"
                style={{
                  animationDelay: `${charIndex * 0.1}s`
                }}
              >
                {char}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

const LoadingHeroSection: React.FC<{ progress: number; isAuthenticating?: boolean }> = ({ progress, isAuthenticating }) => {
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const codeLines = [
    'const developer = {',
    '  name: "Gajanan Vigneswaran",',
    '  role: "CS Undergrad & Developer",',
    '  passion: "Solving real-world problems with AI",',
    '  expertise: ["JavaScript", "React", "Node.js", "PostgreSQL", "Python", "TensorFlow", "LangChain", "AI/ML"],',
    '  mission: "Creating impactful, intelligent software"',
    '};'
  ];

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let fullText = '';
    
    const typeEffect = () => {
      if (currentLine < codeLines.length) {
        const line = codeLines[currentLine];
        
        if (currentChar < line.length) {
          fullText += line[currentChar];
          setTypedText(fullText);
          currentChar++;
        } else {
          if (currentLine < codeLines.length - 1) {
            fullText += '\n';
            setTypedText(fullText);
            currentLine++;
            currentChar = 0;
          }
        }
      }
    };

    const interval = setInterval(typeEffect, 20);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      className="fixed inset-0 flex items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="relative max-w-4xl w-full mx-auto p-8">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Terminal Header */}
          <div className="flex items-center justify-between bg-gray-800/90 backdrop-blur-sm px-6 py-4 rounded-t-2xl border border-purple-500/30">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-2 text-purple-300">
                <Terminal className="w-4 h-4" />
                <span className="text-sm">developer.js</span>
              </div>
            </div>
          </div>

          {/* Terminal Body */}
          <div
            className="bg-gray-900/95 backdrop-blur-sm p-8 rounded-b-2xl border-x border-b border-purple-500/30 min-h-96 relative"
          >
            <div className="text-green-400 font-mono text-lg leading-relaxed">
              <pre className="whitespace-pre-wrap">
                {typedText}
                <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                  █
                </span>
              </pre>
            </div>

            {/* Floating Code Snippets */}
            <div className="absolute inset-0 pointer-events-none">
              {['{', '}', '=>'].map((symbol, i) => (
                <motion.div
                  key={i}
                  className="absolute text-purple-400/30 text-2xl font-mono"
                  style={{
                    left: `${30 + i * 20}%`,
                    top: `${30 + (i % 2) * 20}%`,
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                >
                  {symbol}
                </motion.div>
              ))}
            </div>

            {/* Loading Progress Bar */}
            <div className="absolute bottom-6 left-8 right-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-300 text-sm font-mono">
                  {isAuthenticating && progress >= 100 ? 'Authenticating...' : 'Initializing portfolio...'}
                </span>
                <span className="text-purple-300 text-sm font-mono">
                  {isAuthenticating && progress >= 100 ? '' : `${Math.round(progress)}%`}
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 blur-3xl" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete, isAuthenticating = false }) => {
  const [progress, setProgress] = useState(0);

  // Check if user is on a project page or other non-home page
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash && (hash.startsWith('project/') || hash.startsWith('login') || hash.startsWith('add-project') || hash.startsWith('edit-project') || hash.startsWith('rank-projects'))) {
      // Skip loading screen if not on home page
      onLoadingComplete();
      return;
    }
  }, [onLoadingComplete]);

  // Progress animation (8 seconds) - only runs for home page
  useEffect(() => {
    // Progress animation (12 seconds)
    const startTime = Date.now();
    const duration = 6000; // 12 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        // Wait additional 1-2 seconds after 100% before transitioning
        // Only complete if auth is also done
        setTimeout(() => {
          if (!isAuthenticating) {
            onLoadingComplete();
          }
        }, 1500);
      }
    };

    const animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [onLoadingComplete, isAuthenticating]);

  // Watch for auth completion after initial loading is done
  useEffect(() => {
    if (!isAuthenticating && progress >= 100) {
      const timeout = setTimeout(() => {
        onLoadingComplete();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticating, progress, onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gray-900 z-50">
      <MatrixBackground />
      <LoadingHeroSection progress={progress} isAuthenticating={isAuthenticating} />
    </div>
  );
}; 