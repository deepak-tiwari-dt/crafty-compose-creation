
import React, { useState } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Calendar, Users, Activity, Target, User, FolderOpen } from 'lucide-react';

const Assignments: React.FC = () => {
  const { assignments, profiles, projects, addAssignment, deleteAssignment, loading } = useSupabaseData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    engineer_id: '',
    project_id: '',
    allocation_percentage: 50,
    start_date: '',
    end_date: '',
    role: ''
  });

  const engineers = profiles.filter(p => p.role === 'engineer');

  const handleAddAssignment = async () => {
    if (newAssignment.engineer_id && newAssignment.project_id && newAssignment.role) {
      await addAssignment(newAssignment);
      setNewAssignment({
        engineer_id: '',
        project_id: '',
        allocation_percentage: 50,
        start_date: '',
        end_date: '',
        role: ''
      });
      setIsDialogOpen(false);
    }
  };

  const getEngineerName = (engineerId: string) => {
    return profiles.find(e => e.id === engineerId)?.name || 'Unknown';
  };

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || 'Unknown';
  };

  const getEngineerInfo = (engineerId: string) => {
    return profiles.find(e => e.id === engineerId);
  };

  const getProjectInfo = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce"></div>
          <div className="text-gray-500 text-lg">Loading assignments...</div>
          <div className="space-y-4 w-96">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
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
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-1 animate-pulse">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-600" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-gray-100">
              <Target className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Assignment Center
            </h1>
            <p className="text-gray-600 text-lg">Manage engineer assignments to projects</p>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-1">
              {assignments.length} Active Assignments
            </Badge>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '200ms' }}>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Create New Assignment
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <Select value={newAssignment.engineer_id} onValueChange={(value) => setNewAssignment({ ...newAssignment, engineer_id: value })}>
                  <SelectTrigger className="h-12 focus:ring-2 focus:ring-purple-500">
                    <SelectValue placeholder="Select engineer" />
                  </SelectTrigger>
                  <SelectContent>
                    {engineers.map((engineer) => (
                      <SelectItem key={engineer.id} value={engineer.id}>
                        {engineer.name} ({engineer.department}) - {engineer.seniority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={newAssignment.project_id} onValueChange={(value) => setNewAssignment({ ...newAssignment, project_id: value })}>
                  <SelectTrigger className="h-12 focus:ring-2 focus:ring-purple-500">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name} ({project.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Role (e.g., Developer, Tech Lead, Designer)"
                  value={newAssignment.role}
                  onChange={(e) => setNewAssignment({ ...newAssignment, role: e.target.value })}
                  className="h-12 focus:ring-2 focus:ring-purple-500"
                />

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Allocation Percentage: {newAssignment.allocation_percentage}%
                  </label>
                  <div className="px-3">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="10"
                      value={newAssignment.allocation_percentage}
                      onChange={(e) => setNewAssignment({ ...newAssignment, allocation_percentage: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>10%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                    <Input
                      type="date"
                      value={newAssignment.start_date}
                      onChange={(e) => setNewAssignment({ ...newAssignment, start_date: e.target.value })}
                      className="h-12 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">End Date</label>
                    <Input
                      type="date"
                      value={newAssignment.end_date}
                      onChange={(e) => setNewAssignment({ ...newAssignment, end_date: e.target.value })}
                      className="h-12 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleAddAssignment} 
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300"
                >
                  Create Assignment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {assignments.map((assignment, index) => {
            const engineer = getEngineerInfo(assignment.engineer_id);
            const project = getProjectInfo(assignment.project_id);
            
            return (
              <Card 
                key={assignment.id} 
                className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-600" />
                          </div>
                        </div>
                        <div>
                          <span className="text-lg font-semibold">{getEngineerName(assignment.engineer_id)}</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <FolderOpen className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 font-normal">{getProjectName(assignment.project_id)}</span>
                          </div>
                        </div>
                      </div>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAssignment(assignment.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 p-3 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-gray-500" />
                        <p className="text-sm font-medium text-gray-700">Role</p>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{assignment.role}</p>
                      {engineer && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 text-xs">
                          {engineer.seniority} • {engineer.department}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-gray-500" />
                        <p className="text-sm font-medium text-gray-700">Allocation</p>
                      </div>
                      <div className="space-y-2">
                        <Badge 
                          variant="secondary" 
                          className="text-lg font-bold px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                        >
                          {assignment.allocation_percentage}%
                        </Badge>
                        {project && (
                          <Badge variant="outline" className="text-xs">
                            {project.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <p className="text-sm font-medium text-gray-700">Start Date</p>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">{assignment.start_date}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <p className="text-sm font-medium text-gray-700">End Date</p>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">{assignment.end_date}</p>
                    </div>
                  </div>

                  {/* Additional Project Info */}
                  {project && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700">Project Details</p>
                          <Badge variant="outline" className="text-xs">
                            Team Size: {project.team_size}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{project.description}</p>
                        {project.required_skills && project.required_skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {project.required_skills.slice(0, 5).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {project.required_skills.length > 5 && (
                              <Badge variant="outline" className="text-xs text-gray-500">
                                +{project.required_skills.length - 5} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {assignments.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">No assignments yet</p>
            <p className="text-gray-400">Create your first assignment to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
