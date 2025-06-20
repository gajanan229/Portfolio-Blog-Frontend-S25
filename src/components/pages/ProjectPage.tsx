import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, Calendar, Code, Tag, Edit, Trash2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { useProjects } from '../../hooks/useProjects';
import { useAuth } from '../../hooks/useAuth';
import type { Project } from '../../types';

interface ProjectPageProps {
  project: Project;
  onBack: () => void;
  onEdit?: (projectId: number) => void;
}

export const ProjectPage: React.FC<ProjectPageProps> = ({ project, onBack, onEdit }) => {
  const { deleteProject } = useProjects();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Reset selected image when project changes
  useEffect(() => {
    setSelectedImage(0);
  }, [project]);

  // Helper function to parse languages string
  const parseLanguages = (languages?: string): string[] => {
    if (!languages) return [];
    return languages.split(',').map(lang => lang.trim());
  };

  // Helper function to get all available images
  const getAllImages = (project: Project): string[] => {
    const images: string[] = [];
    
    // Add primary image if it exists
    if (project.image) {
      images.push(project.image);
    }
    
    // Add additional images if they exist and are different from primary
    if (project.images && Array.isArray(project.images)) {
      project.images.forEach(img => {
        if (img && !images.includes(img)) {
          images.push(img);
        }
      });
    }
    
    return images;
  };

  const handleDelete = async () => {
    if (!project) return;
    
    setDeleting(true);
    try {
      const success = await deleteProject(project.id);
      if (success) {
        onBack();
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const allImages = getAllImages(project);
  const languages = parseLanguages(project.languages);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
              'radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
              'radial-gradient(circle at 0% 100%, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
              'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </button>
          </motion.div>

          {/* Hero Section */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    {project.complexity && (
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.complexity === 'Expert' ? 'bg-red-500/20 text-red-400' :
                      project.complexity === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {project.complexity}
                    </div>
                    )}
                    {project.year && (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{project.year}</span>
                    </div>
                    )}
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text">
                      {project.name}
                    </span>
                  </h1>
                  
                  <div className="flex items-center space-x-2 text-gray-400 mb-6">
                    <Code className="w-4 h-4" />
                    <span className="text-lg">{project.type}</span>
                  </div>
                  
                  {project.description && (
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    {project.description}
                  </p>
                  )}
                  
                  <div className="flex items-center space-x-4">
                    {project.github && (
                    <GradientButton
                      onClick={() => window.open(project.github, '_blank')}
                    >
                      <Github className="w-5 h-5 mr-2" />
                      View on GitHub
                    </GradientButton>
                    )}
                    
                    {/* Admin Actions */}
                    {user?.isadmin && (
                      <>
                        <GradientButton
                          onClick={() => onEdit?.(project.id)}
                          variant="secondary"
                        >
                          <Edit className="w-5 h-5 mr-2" />
                          Edit
                        </GradientButton>
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Project Image */}
                <div className="relative">
                  {allImages.length > 0 ? (
                    <motion.div
                      className="relative rounded-2xl overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={allImages[selectedImage]}
                        alt={project.name}
                        className="w-full h-80 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center h-80 bg-gray-800/50 rounded-2xl">
                      <Code className="w-16 h-16 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Image Navigation */}
                  {allImages.length > 1 && (
                    <div className="flex justify-center space-x-2 mt-4">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            selectedImage === index
                              ? 'bg-purple-500'
                              : 'bg-gray-600 hover:bg-gray-500'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Technologies Used */}
          {languages.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Tag className="w-6 h-6 mr-3 text-purple-400" />
                Technologies Used
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {languages.map((tech, index) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <GlassCard className="p-4 text-center" hover>
                      <h3 className="text-white font-medium">{tech}</h3>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
          )}

          {/* Additional Images Gallery */}
          {allImages.length > 1 && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Project Gallery</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allImages.map((image, index) => (
                    <motion.div
                      key={index}
                      className="relative rounded-xl overflow-hidden cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image}
                        alt={`${project.name} screenshot ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full mx-4"
          >
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Delete Project</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{project.name}"? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  {deleting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
};