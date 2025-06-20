
import React, { useState } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

const Projects: React.FC = () => {
  const { projects, addProject, loading } = useSupabaseData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    required_skills: [] as string[],
    team_size: 1,
    status: 'planning' as const
  });

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.required_skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddProject = async () => {
    if (newProject.name && newProject.description) {
      await addProject({
        ...newProject,
        manager_id: user?.id,
      });
      setNewProject({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        required_skills: [],
        team_size: 1,
        status: 'planning'
      });
      setIsDialogOpen(false);
    }
  };

  const handleSkillsChange = (skillsString: string) => {
    const skills = skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
    setNewProject({ ...newProject, required_skills: skills });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'planning':
        return 'secondary';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your engineering projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Project name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
              <Textarea
                placeholder="Project description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
              <Input
                placeholder="Required skills (comma-separated)"
                value={newProject.required_skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={newProject.start_date}
                  onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                />
                <Input
                  type="date"
                  value={newProject.end_date}
                  onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                />
              </div>
              <Input
                type="number"
                placeholder="Team size"
                value={newProject.team_size}
                onChange={(e) => setNewProject({ ...newProject, team_size: parseInt(e.target.value) })}
              />
              <Select value={newProject.status} onValueChange={(value: any) => setNewProject({ ...newProject, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddProject} className="w-full">
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search projects by name or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{project.name}</span>
                <Badge variant={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{project.description}</p>
              
              <div>
                <p className="text-sm font-medium mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-1">
                  {project.required_skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Start Date</p>
                  <p className="text-gray-500">{project.start_date}</p>
                </div>
                <div>
                  <p className="font-medium">End Date</p>
                  <p className="text-gray-500">{project.end_date}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Team Size: {project.team_size}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Projects;
