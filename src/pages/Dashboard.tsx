
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, FolderOpen, Calendar, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser, engineers, projects, assignments } = useApp();

  const getEngineerCapacity = (engineerId: string) => {
    const engineer = engineers.find(e => e.id === engineerId);
    if (!engineer) return { allocated: 0, available: 100 };
    
    const engineerAssignments = assignments.filter(a => a.engineerId === engineerId);
    const totalAllocated = engineerAssignments.reduce((sum, a) => sum + a.allocationPercentage, 0);
    
    return {
      allocated: totalAllocated,
      available: engineer.maxCapacity - totalAllocated
    };
  };

  if (currentUser?.role === 'manager') {
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const totalEngineers = engineers.length;
    const totalAssignments = assignments.length;
    
    const engineersWithCapacity = engineers.map(engineer => {
      const capacity = getEngineerCapacity(engineer.id);
      return {
        ...engineer,
        capacity
      };
    });

    const overutilizedEngineers = engineersWithCapacity.filter(e => e.capacity.allocated > e.maxCapacity).length;

    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600">Overview of your engineering team and projects</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Engineers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEngineers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAssignments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overutilized</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overutilizedEngineers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Team Capacity Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Team Capacity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engineersWithCapacity.map((engineer) => (
                <div key={engineer.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{engineer.name}</p>
                      <p className="text-sm text-gray-500">{engineer.department} • {engineer.seniority}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-48">
                      <Progress 
                        value={(engineer.capacity.allocated / engineer.maxCapacity) * 100} 
                        className="h-2"
                      />
                    </div>
                    <div className="text-sm text-gray-500 min-w-0 w-20">
                      {engineer.capacity.allocated}% allocated
                    </div>
                    {engineer.capacity.allocated > engineer.maxCapacity && (
                      <Badge variant="destructive">Overloaded</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.filter(p => p.status === 'active').map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {project.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Team Size: {project.teamSize}</p>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Engineer Dashboard
  const engineerAssignments = assignments.filter(a => a.engineerId === currentUser?.id);
  const engineer = engineers.find(e => e.id === currentUser?.id);
  const capacity = getEngineerCapacity(currentUser?.id || '');

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600">Your current assignments and capacity</p>
      </div>

      {/* Personal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={(capacity.allocated / (engineer?.maxCapacity || 100)) * 100} />
              <p className="text-sm text-gray-500">
                {capacity.allocated}% of {engineer?.maxCapacity}% capacity
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engineerAssignments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {engineer?.skills.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {engineerAssignments.map((assignment) => {
              const project = projects.find(p => p.id === assignment.projectId);
              return (
                <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{project?.name}</h3>
                    <p className="text-sm text-gray-500">{project?.description}</p>
                    <p className="text-sm text-gray-500">Role: {assignment.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{assignment.allocationPercentage}% allocation</p>
                    <p className="text-sm text-gray-500">
                      {assignment.startDate.toLocaleDateString()} - {assignment.endDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
            {engineerAssignments.length === 0 && (
              <p className="text-gray-500 text-center py-8">No current assignments</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
