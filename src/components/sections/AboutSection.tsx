import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';

export const AboutSection: React.FC = () => {
  const technologies = [
    { name: 'React', path: '/logos/React.png' },
    { name: 'JavaScript', path: '/logos/JavaScript-logo.png' },
    { name: 'Node.js', path: '/logos/node.png' },
    { name: 'Python', path: '/logos/python.webp' },
    { name: 'HTML', path: '/logos/html.webp' },
    { name: 'CSS', path: '/logos/css.webp' },
    { name: 'Java', path: '/logos/java.svg' },
    { name: 'PostgreSQL', path: '/logos/Postgres.png' },
    { name: 'TensorFlow', path: '/logos/tensorflow.png' },
    { name: 'C', path: '/logos/c.png' },
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text">
              About Me
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Passionate developer with a love for creating innovative solutions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Profile Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-6 relative overflow-hidden" hover>
              <div className="aspect-[4/5] max-w-sm mx-auto rounded-2xl overflow-hidden relative">
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
                  alt="Gajanan V"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
              </div>
              
              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-20 blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </GlassCard>
          </motion.div>

          {/* About Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Building the future, one line of code at a time
            </h3>
            
            <p className="text-gray-400 text-lg leading-relaxed">
              I'm a passionate full-stack developer with over 6 years of experience creating 
              innovative web applications and AI-powered solutions. My journey began with a 
              curiosity about how things work, which evolved into a deep love for crafting 
              elegant, efficient code.
            </p>
            
            <p className="text-gray-400 text-lg leading-relaxed">
              When I'm not coding, you'll find me exploring the latest in AI and blockchain 
              technology, contributing to open-source projects, or mentoring aspiring developers. 
              I believe in the power of technology to solve real-world problems and make a 
              positive impact.
            </p>
          </motion.div>
        </div>

        {/* Technologies Grid */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h4 className="text-2xl font-bold text-white mb-8 text-center">Technologies I work with</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 max-w-xs"
              >
                <GlassCard className="p-4 text-center h-full" hover>
                  <motion.div
                    className="flex justify-center items-center mb-2"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={tech.path}
                      alt={tech.name}
                      className="w-16 h-16 object-contain"
                    />
                  </motion.div>
                  <h3 className="text-sm font-medium text-white">{tech.name}</h3>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};