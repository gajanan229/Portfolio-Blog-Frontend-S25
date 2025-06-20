import React from 'react';
import { motion } from 'framer-motion';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
}) => {
  const baseClasses = `
    relative px-8 py-3 rounded-xl font-medium text-white
    transition-all duration-300 overflow-hidden
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  const gradientClasses = variant === 'primary' 
    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500'
    : 'bg-gradient-to-r from-gray-700 to-gray-800';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${gradientClasses}`}
      whileHover={!disabled ? { 
        scale: 1.05,
        boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
      } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 opacity-0"
        whileHover={!disabled ? { opacity: 1 } : undefined}
        transition={{ duration: 0.3 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};