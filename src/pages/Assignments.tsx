
import React, { useState } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600">Manage engineer assignments to projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={newAssignment.engineer_id} onValueChange={(value) => setNewAssignment({ ...newAssignment, engineer_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select engineer" />
                </SelectTrigger>
                <SelectContent>
                  {engineers.map((engineer) => (
                    <SelectItem key={engineer.id} value={engineer.id}>
                      {engineer.name} ({engineer.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={newAssignment.project_id} onValueChange={(value) => setNewAssignment({ ...newAssignment, project_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Role (e.g., Developer, Tech Lead)"
                value={newAssignment.role}
                onChange={(e) => setNewAssignment({ ...newAssignment, role: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Allocation Percentage: {newAssignment.allocation_percentage}%
                </label>
                <Input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={newAssignment.allocation_percentage}
                  onChange={(e) => setNewAssignment({ ...newAssignment, allocation_percentage: parseInt(e.target.value) })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={newAssignment.start_date}
                  onChange={(e) => setNewAssignment({ ...newAssignment, start_date: e.target.value })}
                />
                <Input
                  type="date"
                  value={newAssignment.end_date}
                  onChange={(e) => setNewAssignment({ ...newAssignment, end_date: e.target.value })}
                />
              </div>

              <Button onClick={handleAddAssignment} className="w-full">
                Create Assignment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <span>{getEngineerName(assignment.engineer_id)}</span>
                  <span className="text-gray-500 font-normal ml-2">→ {getProjectName(assignment.project_id)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteAssignment(assignment.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm text-gray-600">{assignment.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Allocation</p>
                  <Badge variant="secondary">{assignment.allocation_percentage}%</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-gray-600">{assignment.start_date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-sm text-gray-600">{assignment.end_date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
