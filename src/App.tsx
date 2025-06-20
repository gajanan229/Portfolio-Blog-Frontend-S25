import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { ContactSection } from './components/sections/ContactSection';
import { ChatBot } from './components/chat/ChatBot';
import { ProjectPage } from './components/pages/ProjectPage';
import { LoginPage } from './components/auth/LoginPage';
import { AddEditProjectPage } from './components/admin/AddEditProjectPage';
import { RankProjectsPage } from './components/admin/RankProjectsPage';
import { useAuth } from './hooks/useAuth';
import { useProjects } from './hooks/useProjects';

type ViewType = 'home' | 'project' | 'login' | 'add-project' | 'edit-project' | 'rank-projects';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const { user, loading: authLoading } = useAuth();
  const { getProjectById } = useProjects();

  const parseHash = useCallback(() => {
    const hash = window.location.hash.substring(1);
    if (hash.startsWith('project/')) {
      const id = parseInt(hash.split('/')[1]);
      if (!isNaN(id)) {
        setSelectedProjectId(id);
        setCurrentView('project');
      } else {
        setCurrentView('home');
        setSelectedProjectId(null);
      }
    } else if (hash.startsWith('add-project')) {
      setCurrentView('add-project');
      setSelectedProjectId(null);
    } else if (hash.startsWith('edit-project/')) {
      const id = parseInt(hash.split('/')[1]);
      if (!isNaN(id)) {
        setSelectedProjectId(id);
        setCurrentView('edit-project');
      } else {
        setCurrentView('home');
        setSelectedProjectId(null);
      }
    } else if (hash.startsWith('rank-projects')) {
      setCurrentView('rank-projects');
    } else if (hash.startsWith('login')) {
      setCurrentView('login');
    } else {
      setCurrentView('home');
      setSelectedProjectId(null);
    }
  }, []);

  useEffect(() => {
    parseHash(); // Parse hash on initial load

    const handleHashChange = () => {
      parseHash();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [parseHash]);

  const handleNavigate = useCallback((section: string, projectId?: number) => {
    if (section === 'login') {
      window.location.hash = 'login';
    } else if (section === 'add-project') {
      if (user?.isadmin) {
        window.location.hash = 'add-project';
      }
    } else if (section === 'edit-project' && projectId !== undefined) {
      if (user?.isadmin) {
        window.location.hash = `edit-project/${projectId}`;
      }
    } else if (section === 'rank-projects') {
      if (user?.isadmin) {
        window.location.hash = 'rank-projects';
      }
    } else if (section === 'project' && projectId !== undefined) {
      window.location.hash = `project/${projectId}`;
    } else {
      window.location.hash = ''; // Navigate to home
      // For non-hash based section scrolling
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [user]);

  const handleProjectClick = useCallback((projectId: number) => {
    handleNavigate('project', projectId);
  }, [handleNavigate]);

  const handleProjectEdit = useCallback((projectId: number) => {
    handleNavigate('edit-project', projectId);
  }, [handleNavigate]);

  const handleBackToHome = useCallback(() => {
    handleNavigate('home');
  }, [handleNavigate]);

  useEffect(() => {
    if (currentView === 'home') {
      const handleScroll = () => {
        const sections = ['hero', 'about', 'projects', 'experience', 'contact'];
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          const element = section === 'hero' ? 
            document.documentElement : 
            document.getElementById(section);
          
          if (element) {
            const offsetTop = section === 'hero' ? 0 : element.offsetTop;
            if (scrollPosition >= offsetTop) {
              break;
            }
          }
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [currentView]);

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-700 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-96 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Render different views based on current state
  if (currentView === 'login') {
    return <LoginPage onBack={handleBackToHome} />;
  }

  if (currentView === 'add-project') {
    if (!user?.isadmin) return <h1 className="text-white">Access Denied</h1>;
    return <AddEditProjectPage onBack={handleBackToHome} />;
  }

  if (currentView === 'edit-project' && selectedProjectId !== null) {
    if (!user?.isadmin) return <h1 className="text-white">Access Denied</h1>;
    const projectToEdit = getProjectById(selectedProjectId);
    return projectToEdit ? (
      <AddEditProjectPage 
        project={projectToEdit} 
        onBack={handleBackToHome}
      />
    ) : <h1 className="text-white">Project Not Found</h1>;
  }

  if (currentView === 'rank-projects') {
    if (!user?.isadmin) return <h1 className="text-white">Access Denied</h1>;
    return <RankProjectsPage onBack={handleBackToHome} />;
  }

  if (currentView === 'project' && selectedProjectId !== null) {
    const selectedProject = getProjectById(selectedProjectId);
    return selectedProject ? (
      <ProjectPage 
        project={selectedProject}
        onBack={handleBackToHome}
        onEdit={handleProjectEdit}
      />
    ) : <h1 className="text-white">Project Not Found</h1>;
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

      <Header onNavigate={handleNavigate} />
      
      <main>
        <HeroSection onNavigate={handleNavigate} />
        <AboutSection />
        <ProjectsSection onProjectClick={handleProjectClick} />
        <ExperienceSection />
        <ContactSection />
      </main>
      
      <Footer />
      <ChatBot />
    </div>
  );
}

export default App;