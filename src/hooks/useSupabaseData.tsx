
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

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

export interface Project {
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

export interface Assignment {
  id: string;
  engineer_id: string;
  project_id: string;
  allocation_percentage: number;
  start_date: string;
  end_date: string;
  role: string;
}

export const useSupabaseData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;
      setProfiles(profilesData || []);

      // Find current user's profile
      const userProfile = profilesData?.find(p => p.id === user.id);
      setCurrentProfile(userProfile || null);

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*');

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

      // Fetch assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*');

      if (assignmentsError) throw assignmentsError;
      setAssignments(assignmentsData || []);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load data. Please refresh the page.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Project operations
  const addProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          manager_id: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Project created successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create project",
      });
    }
  };

  // Assignment operations
  const addAssignment = async (assignmentData: Omit<Assignment, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert([assignmentData])
        .select()
        .single();

      if (error) throw error;

      setAssignments(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Assignment created successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create assignment",
      });
    }
  };

  const deleteAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
      toast({
        title: "Success",
        description: "Assignment deleted successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete assignment",
      });
    }
  };

  return {
    profiles,
    projects,
    assignments,
    currentProfile,
    loading,
    addProject,
    addAssignment,
    deleteAssignment,
    refetch: fetchData,
  };
};
