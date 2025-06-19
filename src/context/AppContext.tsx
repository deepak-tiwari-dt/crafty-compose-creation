
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Project, Assignment, Engineer } from '@/types';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  engineers: Engineer[];
  projects: Project[];
  assignments: Assignment[];
  addProject: (project: Omit<Project, 'id'>) => void;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample data
const sampleEngineers: Engineer[] = [
  {
    id: '1',
    email: 'john.doe@company.com',
    name: 'John Doe',
    role: 'engineer',
    skills: ['React', 'Node.js', 'TypeScript'],
    seniority: 'senior',
    maxCapacity: 100,
    department: 'Frontend'
  },
  {
    id: '2',
    email: 'jane.smith@company.com',
    name: 'Jane Smith',
    role: 'engineer',
    skills: ['Python', 'Django', 'PostgreSQL'],
    seniority: 'mid',
    maxCapacity: 100,
    department: 'Backend'
  },
  {
    id: '3',
    email: 'mike.wilson@company.com',
    name: 'Mike Wilson',
    role: 'engineer',
    skills: ['React', 'Python', 'AWS'],
    seniority: 'senior',
    maxCapacity: 50,
    department: 'Full Stack'
  },
  {
    id: '4',
    email: 'sarah.davis@company.com',
    name: 'Sarah Davis',
    role: 'engineer',
    skills: ['Node.js', 'MongoDB', 'Docker'],
    seniority: 'junior',
    maxCapacity: 100,
    department: 'Backend'
  }
];

const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Build a modern e-commerce platform with React and Node.js',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-04-15'),
    requiredSkills: ['React', 'Node.js', 'PostgreSQL'],
    teamSize: 3,
    status: 'active',
    managerId: 'manager1'
  },
  {
    id: '2',
    name: 'Mobile App Backend',
    description: 'API development for mobile application',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-05-01'),
    requiredSkills: ['Python', 'Django', 'PostgreSQL'],
    teamSize: 2,
    status: 'planning',
    managerId: 'manager1'
  },
  {
    id: '3',
    name: 'Data Analytics Dashboard',
    description: 'Internal analytics dashboard for business metrics',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-01'),
    requiredSkills: ['React', 'Python', 'AWS'],
    teamSize: 2,
    status: 'completed',
    managerId: 'manager1'
  }
];

const sampleAssignments: Assignment[] = [
  {
    id: '1',
    engineerId: '1',
    projectId: '1',
    allocationPercentage: 80,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-04-15'),
    role: 'Tech Lead'
  },
  {
    id: '2',
    engineerId: '2',
    projectId: '2',
    allocationPercentage: 60,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-05-01'),
    role: 'Backend Developer'
  },
  {
    id: '3',
    engineerId: '3',
    projectId: '1',
    allocationPercentage: 50,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-04-15'),
    role: 'Full Stack Developer'
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'manager1',
    email: 'manager@company.com',
    name: 'Alex Manager',
    role: 'manager'
  });
  
  const [engineers] = useState<Engineer[]>(sampleEngineers);
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [assignments, setAssignments] = useState<Assignment[]>(sampleAssignments);

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = {
      ...project,
      id: Math.random().toString(36).substr(2, 9)
    };
    setProjects(prev => [...prev, newProject]);
  };

  const addAssignment = (assignment: Omit<Assignment, 'id'>) => {
    const newAssignment = {
      ...assignment,
      id: Math.random().toString(36).substr(2, 9)
    };
    setAssignments(prev => [...prev, newAssignment]);
  };

  const updateAssignment = (id: string, updatedAssignment: Partial<Assignment>) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === id ? { ...assignment, ...updatedAssignment } : assignment
      )
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      engineers,
      projects,
      assignments,
      addProject,
      addAssignment,
      updateAssignment,
      deleteAssignment
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
