
import { supabase } from '@/integrations/supabase/client';

export interface SeedProfile {
  email: string;
  name: string;
  role: 'manager' | 'engineer';
  skills?: string[];
  seniority?: 'junior' | 'mid' | 'senior';
  max_capacity?: number;
  department?: string;
}

export interface SeedProject {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  required_skills: string[];
  team_size: number;
  status: 'planning' | 'active' | 'completed';
}

export interface SeedAssignment {
  engineer_email: string;
  project_name: string;
  allocation_percentage: number;
  start_date: string;
  end_date: string;
  role: string;
}

const sampleProfiles: SeedProfile[] = [
  {
    email: 'manager@company.com',
    name: 'Sarah Johnson',
    role: 'manager',
    department: 'Engineering',
  },
  {
    email: 'john.doe@company.com',
    name: 'John Doe',
    role: 'engineer',
    skills: ['React', 'TypeScript', 'Node.js'],
    seniority: 'senior',
    max_capacity: 100,
    department: 'Frontend',
  },
  {
    email: 'jane.smith@company.com',
    name: 'Jane Smith',
    role: 'engineer',
    skills: ['Python', 'Django', 'PostgreSQL'],
    seniority: 'mid',
    max_capacity: 80,
    department: 'Backend',
  },
  {
    email: 'mike.wilson@company.com',
    name: 'Mike Wilson',
    role: 'engineer',
    skills: ['React', 'Vue.js', 'CSS'],
    seniority: 'junior',
    max_capacity: 60,
    department: 'Frontend',
  },
  {
    email: 'lisa.chen@company.com',
    name: 'Lisa Chen',
    role: 'engineer',
    skills: ['Java', 'Spring', 'Microservices'],
    seniority: 'senior',
    max_capacity: 100,
    department: 'Backend',
  },
];

const sampleProjects: SeedProject[] = [
  {
    name: 'E-commerce Platform',
    description: 'Build a modern e-commerce platform with React frontend and Node.js backend',
    start_date: '2024-01-15',
    end_date: '2024-06-30',
    required_skills: ['React', 'Node.js', 'TypeScript'],
    team_size: 4,
    status: 'active',
  },
  {
    name: 'Mobile App Backend',
    description: 'Develop REST APIs for mobile application',
    start_date: '2024-02-01',
    end_date: '2024-05-15',
    required_skills: ['Python', 'Django', 'PostgreSQL'],
    team_size: 2,
    status: 'active',
  },
  {
    name: 'Data Analytics Dashboard',
    description: 'Create interactive dashboard for business analytics',
    start_date: '2024-03-01',
    end_date: '2024-07-31',
    required_skills: ['React', 'Python', 'Data Visualization'],
    team_size: 3,
    status: 'planning',
  },
  {
    name: 'Legacy System Migration',
    description: 'Migrate legacy Java application to microservices',
    start_date: '2024-01-01',
    end_date: '2024-03-31',
    required_skills: ['Java', 'Spring', 'Microservices'],
    team_size: 2,
    status: 'completed',
  },
];

const sampleAssignments: SeedAssignment[] = [
  {
    engineer_email: 'john.doe@company.com',
    project_name: 'E-commerce Platform',
    allocation_percentage: 80,
    start_date: '2024-01-15',
    end_date: '2024-06-30',
    role: 'Tech Lead',
  },
  {
    engineer_email: 'jane.smith@company.com',
    project_name: 'Mobile App Backend',
    allocation_percentage: 60,
    start_date: '2024-02-01',
    end_date: '2024-05-15',
    role: 'Backend Developer',
  },
  {
    engineer_email: 'mike.wilson@company.com',
    project_name: 'E-commerce Platform',
    allocation_percentage: 50,
    start_date: '2024-01-15',
    end_date: '2024-06-30',
    role: 'Frontend Developer',
  },
  {
    engineer_email: 'lisa.chen@company.com',
    project_name: 'Legacy System Migration',
    allocation_percentage: 90,
    start_date: '2024-01-01',
    end_date: '2024-03-31',
    role: 'Senior Developer',
  },
];

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Note: In a real application, you would need to create user accounts first
    // For this demo, we'll just create the profiles assuming they exist
    
    // Seed projects first
    console.log('Seeding projects...');
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .upsert(sampleProjects, { onConflict: 'name' })
      .select();

    if (projectsError) {
      console.error('Error seeding projects:', projectsError);
      return;
    }

    console.log('Projects seeded successfully');

    // The assignments would need to be created after users sign up
    // since we need actual user IDs from the auth system
    
    console.log('Database seeding completed!');
    return { success: true, message: 'Sample data created successfully' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: 'Failed to seed database' };
  }
};
