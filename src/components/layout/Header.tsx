import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, LogIn, Plus, BarChart3 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onNavigate: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, logout } = useAuth();

  const navigationItems = [
    { label: 'About', section: 'about' },
    { label: 'Projects', section: 'projects' },
    { label: 'Experience', section: 'experience' },
    { label: 'Contact', section: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 p-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <nav className="max-w-7xl mx-auto backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 shadow-xl">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleNavClick('hero')}
          >
            <img src="/logos/G_Logo.png" alt="Gajanan V Logo" className="h-10 w-auto" />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <motion.button
                key={item.section}
                onClick={() => handleNavClick(item.section)}
                className="text-gray-300 hover:text-white transition-colors duration-300 relative"
                whileHover={{ scale: 1.1 }}
              >
                {item.label}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </div>

          {/* Auth & Admin Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.isadmin && (
                  <>
                    <motion.button
                      onClick={() => handleNavClick('add-project')}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Project</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavClick('rank-projects')}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Rank Projects</span>
                    </motion.button>
                  </>
                )}
                <motion.button
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <User className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={() => handleNavClick('login')}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden px-6 pb-4 border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-4 pt-4">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.section}
                  onClick={() => handleNavClick(item.section)}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              ))}
              
              {user ? (
                <>
                  {user.isadmin && (
                    <>
                      <motion.button
                        onClick={() => handleNavClick('add-project')}
                        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Project</span>
                      </motion.button>
                      <motion.button
                        onClick={() => handleNavClick('rank-projects')}
                        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                        whileTap={{ scale: 0.95 }}
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Rank Projects</span>
                      </motion.button>
                    </>
                  )}
                  <motion.button
                    onClick={logout}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="w-4 h-4" />
                    <span>Logout</span>
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={() => handleNavClick('login')}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};