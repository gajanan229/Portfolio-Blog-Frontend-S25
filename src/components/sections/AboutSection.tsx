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
  ];

  return (
    <section
      id="about"
      className="relative z-30 py-20 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text">
              The Developer Behind the Code
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Transforming ideas into reality through innovative technology and creative problem-solving
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-6 h-full relative overflow-hidden" hover>
              {/* Profile Image */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden relative">
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
                  alt="Gajanan V"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 text-center">Gajanan V</h3>
              <div className="space-y-3 text-gray-300 text-sm">
                <p>
                  Driven computer science student with hands-on experience in machine learning, full-stack development, and applied research.</p>
                <p>
                  I combine academic knowledge with real-world skills in Python, TensorFlow, React, and more. With a focus on usability, performance, and ethical innovation, I enjoy transforming complex challenges into intuitive solutions.                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">2+</div>
                  <div className="text-sm text-gray-400">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">10+</div>
                  <div className="text-sm text-gray-400">Projects Completed</div>
                </div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-20 blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </GlassCard>
          </motion.div>

          {/* Technologies Grid */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold text-white mb-6 text-center lg:text-left">Technologies I work with</h4>
            <div className="grid grid-cols-3 gap-4">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
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
                        className="w-12 h-12 object-contain"
                      />
                    </motion.div>
                    <h3 className="text-sm font-medium text-white">{tech.name}</h3>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};