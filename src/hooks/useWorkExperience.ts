import { useState, useEffect } from 'react';
import type { WorkExperience } from '../types';

const BASE_URL = import.meta.env.VITE_BASE_URL;
if (!BASE_URL) {
    throw new Error("Missing BASE_URL environment variable.");
}

export const useWorkExperience = () => {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/work-experiences`);
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      }
    } catch (error) {
      console.error('Failed to fetch work experiences:', error);
      // Mock data for development
      setExperiences([
        {
          id: '1',
          title: 'Senior Full Stack Developer',
          company: 'TechCorp Innovation',
          location: 'San Francisco, CA',
          date_range: '2022 - Present',
          details: [
            'Led development of microservices architecture serving 1M+ users',
            'Implemented AI-driven features that increased user engagement by 40%',
            'Mentored team of 5 junior developers',
            'Architected scalable cloud infrastructure on AWS'
          ]
        },
        {
          id: '2',
          title: 'Full Stack Developer',
          company: 'StartupX',
          location: 'Austin, TX',
          date_range: '2020 - 2022',
          details: [
            'Built MVP from ground up using React, Node.js, and PostgreSQL',
            'Developed real-time features using WebSockets and Redis',
            'Integrated third-party APIs and payment systems',
            'Achieved 99.9% uptime across production systems'
          ]
        },
        {
          id: '3',
          title: 'Software Engineer',
          company: 'Global Solutions Inc',
          location: 'Remote',
          date_range: '2018 - 2020',
          details: [
            'Developed enterprise web applications using Angular and Spring Boot',
            'Optimized database queries reducing response time by 60%',
            'Implemented automated testing suite with 90% code coverage',
            'Collaborated with cross-functional teams across multiple time zones'
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { experiences, loading };
};