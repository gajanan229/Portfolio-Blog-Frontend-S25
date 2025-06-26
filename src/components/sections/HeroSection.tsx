import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { TypewriterText } from '../ui/TypewriterText';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const roles = [
    'Software Developer',
    'AI Innovator',
    'Full Stack Engineer',
    'Tech Enthusiast',
    'Problem Solver'
  ];

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-16">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-orange-900/20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 60%, rgba(249, 115, 22, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text">
            Gajanan V
          </span>
        </motion.h1>

        <motion.div
          className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-light text-gray-300 mb-8 sm:mb-12 h-12 sm:h-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <TypewriterText texts={roles} speed={100} delay={2000} />
        </motion.div>

        <motion.p
          className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-10 sm:mb-16 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Crafting innovative solutions with cutting-edge technology.
          Passionate about AI, blockchain, and creating exceptional user experiences.
        </motion.p>

        <motion.button
          onClick={() => onNavigate('projects')}
          className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-full text-white font-medium text-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-orange-700"
            initial={{ x: '-100%' }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10">Explore My Work</span>
        </motion.button>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 mx-auto cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        onClick={() => onNavigate('about')}
      >
        <motion.div
          className="flex flex-col items-center space-y-2 text-gray-400 hover:text-white transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-purple-400 to-transparent" />
          <motion.div
            className="p-2 rounded-full border border-purple-400/30"
            whileHover={{ scale: 1.1, borderColor: 'rgba(147, 51, 234, 0.8)' }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};