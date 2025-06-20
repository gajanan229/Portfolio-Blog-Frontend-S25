import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Image, Github, Tag } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { NeumorphicInput } from '../ui/NeumorphicInput';
import { GradientButton } from '../ui/GradientButton';
import { useProjects } from '../../hooks/useProjects';
import type { Project } from '../../types';

interface AddEditProjectPageProps {
  project?: Project;
  onBack: () => void;
}

export const AddEditProjectPage: React.FC<AddEditProjectPageProps> = ({ project, onBack }) => {
  const { createProject, updateProject } = useProjects();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    complexity: 'Beginner',
    year: new Date().getFullYear(),
    description: '',
    github: '',
    languages: '',
    image: '',
    images: [] as string[],
    rank: 0,
  });
  const [newImage, setNewImage] = useState('');

  const isEditing = !!project;

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        type: project.type || '',
        complexity: project.complexity || 'Beginner',
        year: project.year || new Date().getFullYear(),
        description: project.description || '',
        github: project.github || '',
        languages: project.languages || '',
        image: project.image || '',
        images: project.images || [],
        rank: project.rank || 0,
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Backend expects rank in the complexity field due to a bug
    const payload = {
      ...formData,
      complexity: formData.rank.toString(),
    };

    try {
      const success = isEditing
        ? await updateProject(project!.id, payload)
        : await createProject(payload);

      if (success) {
        onBack();
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData({
        ...formData,
        images: [...formData.images, newImage.trim()]
      });
      setNewImage('');
    }
  };

  const removeImage = (image: string) => {
    setFormData({
      ...formData,
      images: formData.images.filter(i => i !== image)
    });
  };

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
            <h1 className="text-4xl font-bold">
              <span className="text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text">
                {isEditing ? 'Edit Project' : 'Add New Project'}
              </span>
            </h1>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Name
                    </label>
                    <NeumorphicInput
                      placeholder="Enter project name"
                      value={formData.name}
                      onChange={(value) => setFormData({ ...formData, name: value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Type
                    </label>
                    <NeumorphicInput
                      placeholder="e.g., Web Application, Mobile App"
                      value={formData.type}
                      onChange={(value) => setFormData({ ...formData, type: value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Complexity
                    </label>
                    <select
                      value={formData.complexity}
                      onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Year
                    </label>
                    <NeumorphicInput
                      type="number"
                      placeholder="2024"
                      value={formData.year.toString()}
                      onChange={(value) => setFormData({ ...formData, year: parseInt(value) || new Date().getFullYear() })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <NeumorphicInput
                    multiline
                    rows={4}
                    placeholder="Describe your project..."
                    value={formData.description}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                  />
                </div>
                
                {/* GitHub URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Github className="w-4 h-4 inline mr-2" />
                    GitHub URL
                  </label>
                  <NeumorphicInput
                    placeholder="https://github.com/..."
                    value={formData.github}
                    onChange={(value) => setFormData({ ...formData, github: value })}
                  />
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Tag className="w-4 h-4 inline mr-2" />
                    Languages (comma-separated)
                  </label>
                  <NeumorphicInput
                    placeholder="e.g., React, Node.js, Python"
                    value={formData.languages}
                    onChange={(value) => setFormData({ ...formData, languages: value })}
                  />
                </div>

                {/* Main Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Image className="w-4 h-4 inline mr-2" />
                    Main Image URL
                  </label>
                  <NeumorphicInput
                    placeholder="https://example.com/image.png"
                    value={formData.image}
                    onChange={(value) => setFormData({ ...formData, image: value })}
                  />
                </div>

                {/* Additional Images */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">
                    <Image className="w-4 h-4 inline mr-2" />
                    Additional Images
                  </label>
                  
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <p className="flex-1 text-gray-400 truncate">{image}</p>
                      <button 
                        type="button"
                        onClick={() => removeImage(image)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        &times;
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center space-x-2">
                    <NeumorphicInput
                      placeholder="Add image URL"
                      value={newImage}
                      onChange={setNewImage}
                    />
                    <button type="button" onClick={addImage} className="p-2 bg-purple-500/20 rounded-xl">
                      <Plus className="w-5 h-5 text-purple-400" />
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <GradientButton type="submit" disabled={saving} className="w-full flex items-center justify-center">
                    <Save className="w-5 h-5 mr-2" />
                    {saving ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
                  </GradientButton>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};