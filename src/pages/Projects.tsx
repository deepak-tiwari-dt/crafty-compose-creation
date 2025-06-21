
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
import { Plus, FolderOpen, Calendar, Users, Search, Zap, Target, Clock } from 'lucide-react';

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
        return 'from-green-500 to-emerald-500';
      case 'planning':
        return 'from-blue-500 to-cyan-500';
      case 'completed':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce"></div>
          <div className="text-gray-500 text-lg">Loading projects...</div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-32 h-24 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative inline-block">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full p-1 animate-pulse">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-gray-600" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-gray-100">
              <Target className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Project Portfolio
            </h1>
            <p className="text-gray-600 text-lg">Manage and track your engineering projects</p>
            <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 px-4 py-1">
              {projects.length} Projects
            </Badge>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-0 shadow-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Create New Project
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <Input
                  placeholder="Project name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="h-12 focus:ring-2 focus:ring-green-500"
                />
                <Textarea
                  placeholder="Project description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="min-h-24 focus:ring-2 focus:ring-green-500"
                />
                <Input
                  placeholder="Required skills (comma-separated)"
                  value={newProject.required_skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  className="h-12 focus:ring-2 focus:ring-green-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                    <Input
                      type="date"
                      value={newProject.start_date}
                      onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                      className="h-12 focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">End Date</label>
                    <Input
                      type="date"
                      value={newProject.end_date}
                      onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                      className="h-12 focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Team Size</label>
                    <Input
                      type="number"
                      placeholder="Team size"
                      value={newProject.team_size}
                      onChange={(e) => setNewProject({ ...newProject, team_size: parseInt(e.target.value) })}
                      className="h-12 focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Select value={newProject.status} onValueChange={(value: any) => setNewProject({ ...newProject, status: value })}>
                      <SelectTrigger className="h-12 focus:ring-2 focus:ring-green-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={handleAddProject} 
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300"
                >
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <Card 
              key={project.id} 
              className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in transform hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </CardTitle>
                    <Badge 
                      className={`bg-gradient-to-r ${getStatusColor(project.status)} text-white border-0`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className={`p-2 bg-gradient-to-r ${getStatusColor(project.status)} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Target className="w-4 h-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 pt-6">
                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
                
                {/* Required Skills */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-gray-500" />
                    <p className="text-sm font-medium text-gray-700">Required Skills</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.required_skills.slice(0, 4).map((skill, idx) => (
                      <Badge 
                        key={skill} 
                        variant="outline" 
                        className="text-xs hover:bg-green-50 hover:border-green-300 transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        {skill}
                      </Badge>
                    ))}
                    {project.required_skills.length > 4 && (
                      <Badge variant="outline" className="text-xs text-gray-500">
                        +{project.required_skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <p className="text-xs font-medium text-gray-700">Start Date</p>
                    </div>
                    <p className="text-sm text-gray-600">{project.start_date}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <p className="text-xs font-medium text-gray-700">End Date</p>
                    </div>
                    <p className="text-sm text-gray-600">{project.end_date}</p>
                  </div>
                </div>

                {/* Team Size */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-medium text-gray-700">Team Size</p>
                    </div>
                    <Badge variant="secondary" className="font-semibold">
                      {project.team_size}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">No projects found</p>
            <p className="text-gray-400">Try adjusting your search terms or create a new project</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
