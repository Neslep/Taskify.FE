import { useState, useEffect, useCallback } from 'react';

import { API_BASE_URL } from '../../config';

// ----------------------------------------------------------------------

export function useMemberData() {
  const [members, setMembers] = useState([]);

  const fetchMembers = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const response = await fetch(`${API_BASE_URL}api/projects/owned-project-members`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.isSuccess) {
        const membersData = result.data.$values.map((member: any) => ({
          id: member.id,
          userName: member.userName,
          gender: member.gender,
          email: member.email,
        }));
        setMembers(membersData);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members };
}
