import { useState, useEffect, useCallback } from 'react';

import { API_BASE_URL } from '../../config';

// ----------------------------------------------------------------------

export function useProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwttoken');
      if (!token) return;
      const response = await fetch(`${API_BASE_URL}api/projects`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.isSuccess) {
        const projectsData = result.data.$values.map((project: any) => ({
          ...project,
          userProjects: project.userProjects.$values,
        }));
        setProjects(projectsData);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, fetchProjects };
}
