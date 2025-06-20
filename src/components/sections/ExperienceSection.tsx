import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { useWorkExperience } from '../../hooks/useWorkExperience';

export const ExperienceSection: React.FC = () => {
  const { experiences, loading } = useWorkExperience();
  const [selectedExperience, setSelectedExperience] = useState(0);

  if (loading) {
    return (
      <section id="experience" className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 px-4">
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
              Experience
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            My journey through the world of technology and innovation
          </p>
        </motion.div>

        <GlassCard className="p-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Experience List */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <motion.button
                    key={exp.id}
                    onClick={() => setSelectedExperience(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      selectedExperience === index
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-l-4 border-purple-500'
                        : 'hover:bg-white/5'
                    }`}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white text-sm mb-1">
                          {exp.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{exp.company}</p>
                      </div>
                      <ChevronRight 
                        className={`w-4 h-4 transition-transform ${
                          selectedExperience === index ? 'rotate-90 text-purple-400' : 'text-gray-500'
                        }`} 
                      />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Experience Details */}
            <div className="lg:col-span-2">
              <motion.div
                key={selectedExperience}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                {experiences[selectedExperience] && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {experiences[selectedExperience].title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-purple-400">
                            {experiences[selectedExperience].company}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{experiences[selectedExperience].location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{experiences[selectedExperience].date_range}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">
                        Key Achievements
                      </h4>
                      <ul className="space-y-3">
                        {experiences[selectedExperience].details.map((detail, detailIndex) => (
                          <motion.li
                            key={detailIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: detailIndex * 0.1 }}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-gray-400 leading-relaxed">{detail}</p>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Decorative Element */}
                    <motion.div
                      className="absolute -right-4 -bottom-4 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};