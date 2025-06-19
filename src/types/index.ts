
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'manager' | 'engineer';
  skills?: string[];
  seniority?: 'junior' | 'mid' | 'senior';
  maxCapacity?: number;
  department?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  requiredSkills: string[];
  teamSize: number;
  status: 'planning' | 'active' | 'completed';
  managerId: string;
}

export interface Assignment {
  id: string;
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: Date;
  endDate: Date;
  role: string;
}

export interface Engineer extends User {
  role: 'engineer';
  skills: string[];
  seniority: 'junior' | 'mid' | 'senior';
  maxCapacity: number;
  department: string;
}
