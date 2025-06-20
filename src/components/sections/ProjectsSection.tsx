import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { useProjects } from '../../hooks/useProjects';
import type { Project } from '../../types';

interface ProjectsSectionProps {
  onProjectClick: (projectId: number) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onProjectClick }) => {
  const { projects, loading } = useProjects();
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  // Sort projects by rank (ascending order, with null/undefined ranks at the end)
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.rank == null && b.rank == null) return 0;
    if (a.rank == null) return 1;
    if (b.rank == null) return -1;
    return a.rank - b.rank;
  });

  // Helper function to parse languages string
  const parseLanguages = (languages?: string): string[] => {
    if (!languages) return [];
    return languages.split(',').map(lang => lang.trim());
  };

  // Helper function to get display image
  const getDisplayImage = (project: Project | undefined): string => {
    if (!project) return '';
    // First try the images array
    if (project.images && Array.isArray(project.images) && project.images.length > 0) {
      return project.images[0];
    }
    // Fallback to the image field
    return project.image || '';
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 px-4">
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
    <section id="projects" className="py-20 px-4">
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
              Featured Projects
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A showcase of innovative solutions and creative problem-solving
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Project Preview - 2/3 width */}
          <div className="lg:col-span-2">
            <motion.div
              className="sticky top-24"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 h-[500px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {hoveredProject ? (
                    <motion.div
                      key={hoveredProject}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full"
                    >
                      {(() => {
                        const project = sortedProjects.find(p => p.id === hoveredProject);
                        const displayImage = getDisplayImage(project);
                        return displayImage ? (
                          <div className="relative w-full h-full rounded-xl overflow-hidden">
                            <img
                              src={displayImage}
                              alt={project?.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                              <h4 className="text-white font-bold text-2xl mb-3">
                                {project?.name}
                              </h4>
                              <p className="text-gray-300 text-base line-clamp-3 mb-4">
                                {project?.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {parseLanguages(project?.languages).slice(0, 4).map((tech) => (
                                  <span
                                    key={tech}
                                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <div className="text-center">
                              <Code className="w-20 h-20 mx-auto mb-6 opacity-50" />
                              <p className="text-lg">Preview coming soon</p>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-gray-400"
                    >
                      <Code className="w-20 h-20 mx-auto mb-6 opacity-50" />
                      <p className="text-lg">Hover over a project to see preview</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          </div>

          {/* Projects List - 1/3 width */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="h-[500px]"
            >
              <GlassCard className="p-4 h-full">
                <div className="h-full overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
                  {sortedProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      onHoverStart={() => setHoveredProject(project.id)}
                      onHoverEnd={() => setHoveredProject(null)}
                    >
                      <GlassCard 
                        className="p-4 cursor-pointer relative overflow-hidden" 
                        hover
                        onClick={() => onProjectClick(project.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">
                              {project.name}
                            </h3>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.complexity === 'Expert' ? 'bg-red-500/20 text-red-400' :
                            project.complexity === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {project.type}
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1 mb-3">
                            {parseLanguages(project.languages).slice(0, 2).map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-300"
                              >
                                {tech}
                              </span>
                            ))}
                            {parseLanguages(project.languages).length > 2 && (
                              <span className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-300">
                                +{parseLanguages(project.languages).length - 2}
                              </span>
                            )}
                          </div>
                          <motion.div
                            className="flex items-center space-x-1 text-purple-400 text-xs"
                            whileHover={{ scale: 1.05 }}
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Details</span>
                          </motion.div>
                        </div>

                        {/* Hover Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-0"
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};