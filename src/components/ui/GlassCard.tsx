import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  return (
    <motion.div
      className={`
        backdrop-blur-md bg-white/5 rounded-2xl border border-white/10
        shadow-xl shadow-black/20 ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={hover ? {
        scale: 1.02,
        y: -5,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      } : undefined}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};