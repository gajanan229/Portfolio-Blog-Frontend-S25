import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const socialLinks = [
    { icon: Github, href: 'https://github.com/gajanan229', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/gajanan-vigneswaran', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:gajanan.vig@gmail.com', label: 'Email' },
  ];

  return (
    <footer className="relative py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <motion.h3
                className="text-2xl font-bold mb-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text">
                  Gajanan V
                </span>
              </motion.h3>
              <motion.p
                className="text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Software Developer & AI Innovator
              </motion.p>
            </div>

            <div className="flex items-center space-x-6">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-300"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          <motion.div
            className="mt-8 pt-6 border-t border-white/10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-gray-400 flex items-center justify-center space-x-2">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </motion.div>
              <span>using React, Framer Motion & Tailwind CSS</span>
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};