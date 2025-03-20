import React from 'react';

const ApiService = {
  // Get all skills
  getAllSkills: async () => {
    try {
      const response = await fetch('/api/skills');
      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  },

  // Get a specific skill
  getSkill: async (id) => {
    try {
      const response = await fetch(`/api/skills/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch skill');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching skill:', error);
      throw error;
    }
  },

  // Create a new skill
  createSkill: async (skillData) => {
    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(skillData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create skill');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
  },

  // Delete a skill
  deleteSkill: async (id) => {
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete skill');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  }
};

export default ApiService;
