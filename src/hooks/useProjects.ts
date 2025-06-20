import { useState, useEffect } from 'react';
import type { Project } from '../types';

const BASE_URL = import.meta.env.VITE_BASE_URL;
if (!BASE_URL) {
    throw new Error("Missing BASE_URL environment variable.");
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      // Mock data for development
      setProjects([
        {
          id: 1,
          name: 'AI-Powered Analytics Dashboard',
          type: 'Web Application',
          image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg',
          images: ['https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg'],
          complexity: 'Advanced',
          rank: 1,
          year: 2024,
          languages: 'React,TypeScript,Python,TensorFlow',
          description: 'A comprehensive analytics dashboard that leverages machine learning to provide predictive insights and real-time data visualization.',
          github: 'https://github.com/gajanan/ai-analytics'
        },
        {
          id: 2,
          name: 'Blockchain Voting System',
          type: 'Blockchain Application',
          image: 'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg',
          images: ['https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg'],
          complexity: 'Expert',
          rank: 2,
          year: 2023,
          languages: 'Solidity,React,Web3.js,Node.js',
          description: 'A secure, transparent voting system built on Ethereum blockchain ensuring immutable and verifiable election results.',
          github: 'https://github.com/gajanan/blockchain-voting'
        },
        {
          id: 3,
          name: 'Real-time Collaboration Tool',
          type: 'Web Application',
          image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
          images: ['https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg'],
          complexity: 'Advanced',
          rank: 3,
          year: 2023,
          languages: 'React,Socket.io,Node.js,MongoDB',
          description: 'A real-time collaborative workspace enabling teams to work together seamlessly with live editing, video calls, and project management features.',
          github: 'https://github.com/gajanan/collab-tool'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getProject = async (id: number): Promise<Project | null> => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
    
    // Mock fallback
    return projects.find(p => p.id === id) || null;
  };

  const createProject = async (project: Omit<Project, 'id'>): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
        credentials: "include",
      });
      
      if (response.ok) {
        await fetchProjects();
        return true;
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
    return false;
  };

  const updateProject = async (id: number, updates: Partial<Project>): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      
      if (response.ok) {
        await fetchProjects();
        return true;
      }
    } catch (error) {
      console.error('Failed to update project:', error);
    }
    return false;
  };

  const deleteProject = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects/${id}`, {
        method: 'DELETE',
        credentials: "include",
      });
      
      if (response.ok) {
        await fetchProjects();
        return true;
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
    return false;
  };

  const getProjectById = (id: number): Project | undefined => {
    return projects.find(p => p.id === id);
  };

  return {
    projects,
    loading,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
    getProjectById,
  };
};