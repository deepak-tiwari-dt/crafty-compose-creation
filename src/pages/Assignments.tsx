
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

const Assignments: React.FC = () => {
  const { assignments, engineers, projects, addAssignment, deleteAssignment } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    engineerId: '',
    projectId: '',
    allocationPercentage: 50,
    startDate: '',
    endDate: '',
    role: ''
  });

  const handleAddAssignment = () => {
    if (newAssignment.engineerId && newAssignment.projectId && newAssignment.role) {
      addAssignment({
        ...newAssignment,
        startDate: new Date(newAssignment.startDate),
        endDate: new Date(newAssignment.endDate)
      });
      setNewAssignment({
        engineerId: '',
        projectId: '',
        allocationPercentage: 50,
        startDate: '',
        endDate: '',
        role: ''
      });
      setIsDialogOpen(false);
    }
  };

  const getEngineerName = (engineerId: string) => {
    return engineers.find(e => e.id === engineerId)?.name || 'Unknown';
  };

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || 'Unknown';
  };

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
              <Select value={newAssignment.engineerId} onValueChange={(value) => setNewAssignment({ ...newAssignment, engineerId: value })}>
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

              <Select value={newAssignment.projectId} onValueChange={(value) => setNewAssignment({ ...newAssignment, projectId: value })}>
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
                  Allocation Percentage: {newAssignment.allocationPercentage}%
                </label>
                <Input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={newAssignment.allocationPercentage}
                  onChange={(e) => setNewAssignment({ ...newAssignment, allocationPercentage: parseInt(e.target.value) })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={newAssignment.startDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, startDate: e.target.value })}
                />
                <Input
                  type="date"
                  value={newAssignment.endDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, endDate: e.target.value })}
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
                  <span>{getEngineerName(assignment.engineerId)}</span>
                  <span className="text-gray-500 font-normal ml-2">→ {getProjectName(assignment.projectId)}</span>
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
                  <Badge variant="secondary">{assignment.allocationPercentage}%</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-gray-600">{assignment.startDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-sm text-gray-600">{assignment.endDate.toLocaleDateString()}</p>
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
