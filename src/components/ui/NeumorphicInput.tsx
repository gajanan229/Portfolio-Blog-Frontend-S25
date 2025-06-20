import React from 'react';
import { motion } from 'framer-motion';

interface NeumorphicInputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  rows?: number;
}

export const NeumorphicInput: React.FC<NeumorphicInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  multiline = false,
  rows = 4,
}) => {
  const baseClasses = `
    w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm
    border border-gray-700/50 rounded-xl
    text-white placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-purple-500/50
    focus:border-purple-500/50 transition-all duration-300
    shadow-inner shadow-black/20
    ${className}
  `;

  const Component = multiline ? motion.textarea : motion.input;

  return (
    <Component
      type={multiline ? undefined : type}
      placeholder={placeholder}
      value={value}
      onChange={(e: any) => onChange(e.target.value)}
      rows={multiline ? rows : undefined}
      className={baseClasses}
      whileFocus={{
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
        scale: 1.02,
      }}
      transition={{ duration: 0.2 }}
    />
  );
};