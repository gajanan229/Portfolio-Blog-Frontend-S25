import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, GripVertical, Save } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { useProjects } from '../../hooks/useProjects';
import type { Project } from '../../types';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from '../ui/SortableItem';

interface RankProjectsPageProps {
  onBack: () => void;
}

export const RankProjectsPage: React.FC<RankProjectsPageProps> = ({ onBack }) => {
  const { projects, loading, updateProject } = useProjects();
  const [rankedProjects, setRankedProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);

  // Dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    // Sort projects by existing rank if available, otherwise by id
    const sorted = [...projects].sort((a, b) => {
      if (a.rank != null && b.rank != null) {
        return a.rank - b.rank;
      }
      // Projects without a rank go to the end, maintaining relative order
      if (a.rank == null) return 1;
      if (b.rank == null) return -1;
      return 0; // Should not happen if previous conditions are met
    });
    setRankedProjects(sorted);
  }, [projects]);

  const parseLanguages = (languages?: string): string[] => {
    if (!languages) return [];
    return languages.split(',').map(lang => lang.trim());
  };

  // Helper function to get display image
  const getDisplayImage = (project: Project): string => {
    // First try the images array
    if (project.images && Array.isArray(project.images) && project.images.length > 0) {
      return project.images[0];
    }
    // Fallback to the image field
    return project.image || '';
  };

  const handleSaveRanking = async () => {
    setSaving(true);
    try {
      const updates = rankedProjects.map(project => ({
        id: project.id,
        rank: project.rank,
      }));

      // Send individual PATCH requests for each updated project rank
      await Promise.all(
        updates.map(async (update) => {
          const success = await updateProject(update.id, { complexity: update.rank } as any);
          if (!success) {
            throw new Error(`Failed to update rank for project ${update.id}`);
          }
        })
      );
      alert("Project ranks updated successfully!");
      onBack();
    } catch (error) {
      console.error('Failed to save ranking:', error);
      alert("Error saving project ranks.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-700 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-96 mx-auto"></div>
        </div>
      </div>
    );
  }

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
      </div>

      <div className="relative z-10 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text">
                Rank Projects
              </span>
            </h1>
            <p className="text-gray-400">
              Drag and drop projects to reorder them by importance or preference
            </p>
          </motion.div>

          {/* Projects List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-6">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event: DragEndEvent) => {
                  const { active, over } = event;
                  if (active.id !== over?.id) {
                    const oldIndex = rankedProjects.findIndex((p) => p.id === active.id);
                    const newIndex = rankedProjects.findIndex((p) => p.id === over?.id);
                    const newProjects = arrayMove(rankedProjects, oldIndex, newIndex);

                    // Update ranks based on new order (index + 1)
                    const updatedProjectsWithRanks = newProjects.map((project, index) => ({
                      ...project,
                      rank: index + 1,
                    }));
                    setRankedProjects(updatedProjectsWithRanks);
                  }
                }}
              >
                <SortableContext
                  items={rankedProjects.map((project) => project.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {rankedProjects.map((project, index) => (
                      <SortableItem key={project.id} id={project.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="cursor-grab"
                        >
                          <GlassCard className="p-4 hover:bg-white/10 transition-colors duration-300">
                            <div className="flex items-center space-x-4">
                              {/* Drag Handle */}
                              <div className="text-gray-400 hover:text-white transition-colors">
                                <GripVertical className="w-5 h-5" />
                              </div>

                              {/* Rank Number */}
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>

                              {/* Project Image */}
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                                {getDisplayImage(project) ? (
                                  <img
                                    src={getDisplayImage(project)}
                                    alt={project.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    <span className="text-xs">No Image</span>
                                  </div>
                                )}
                              </div>

                              {/* Project Info */}
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-white mb-1">
                                  {project.name}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                  <span>{project.type}</span>
                                  <span>•</span>
                                  <span>{project.year}</span>
                                  <span>•</span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    project.complexity === 'Expert' ? 'bg-red-500/20 text-red-400' :
                                    project.complexity === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                                    'bg-green-500/20 text-green-400'
                                  }`}>
                                    {project.complexity}
                                  </span>
                                </div>
                              </div>

                              {/* Technologies */}
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {parseLanguages(project.languages).slice(0, 3).map((tech) => (
                                  <span
                                    key={tech}
                                    className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-300"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {parseLanguages(project.languages).length > 3 && (
                                  <span className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-300">
                                    +{parseLanguages(project.languages).length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          </GlassCard>
                        </motion.div>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <GradientButton
                  onClick={handleSaveRanking}
                  disabled={saving}
                  className="flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Ranking</span>
                    </>
                  )}
                </GradientButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};