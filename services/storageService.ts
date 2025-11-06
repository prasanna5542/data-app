
import { Project } from '../types';

const STORAGE_KEY = 'vfxCameraLogProjects';

export const getProjects = (): Project[] => {
  try {
    const storedProjects = localStorage.getItem(STORAGE_KEY);
    if (storedProjects) {
      return JSON.parse(storedProjects);
    }
  } catch (error) {
    console.error("Failed to parse projects from localStorage", error);
  }
  return [];
};

export const saveProjects = (projects: Project[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error("Failed to save projects to localStorage", error);
  }
};
