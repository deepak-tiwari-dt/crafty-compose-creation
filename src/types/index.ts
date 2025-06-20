
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

// Supabase types
export interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'manager' | 'engineer';
  skills: string[];
  seniority?: 'junior' | 'mid' | 'senior';
  max_capacity?: number;
  department?: string;
}

export interface SupabaseProject {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  required_skills: string[];
  team_size: number;
  status: 'planning' | 'active' | 'completed';
  manager_id?: string;
}

export interface SupabaseAssignment {
  id: string;
  engineer_id: string;
  project_id: string;
  allocation_percentage: number;
  start_date: string;
  end_date: string;
  role: string;
}
