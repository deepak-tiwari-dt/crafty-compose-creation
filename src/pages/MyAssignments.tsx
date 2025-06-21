
import React from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, User } from 'lucide-react';

const MyAssignments: React.FC = () => {
  const { assignments, projects, currentProfile, loading } = useSupabaseData();
  const { user } = useAuth();

  const myAssignments = assignments.filter(a => a.engineer_id === user?.id);
  
  const getProject = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  const getTotalAllocation = () => {
    return myAssignments.reduce((sum, assignment) => sum + assignment.allocation_percentage, 0);
  };

  const getAvailableCapacity = () => {
    const maxCapacity = currentProfile?.max_capacity || 100;
    const allocated = getTotalAllocation();
    return maxCapacity - allocated;
  };

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
        <p className="text-gray-600">Your current and upcoming project assignments</p>
      </div>

      {/* Capacity Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Capacity Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Allocation</p>
              <p className="text-2xl font-bold text-blue-600">{getTotalAllocation()}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Available Capacity</p>
              <p className="text-2xl font-bold text-green-600">{getAvailableCapacity()}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Max Capacity</p>
              <p className="text-2xl font-bold text-gray-900">{currentProfile?.max_capacity}%</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Workload Distribution</p>
              <p className="text-sm text-gray-500">
                {getTotalAllocation()}% of {currentProfile?.max_capacity}%
              </p>
            </div>
            <Progress 
              value={(getTotalAllocation() / (currentProfile?.max_capacity || 100)) * 100} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Assignments */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Current Assignments ({myAssignments.length})</h2>
        
        {myAssignments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No current assignments</p>
              <p className="text-sm text-gray-400">You're available for new projects!</p>
            </CardContent>
          </Card>
        ) : (
          myAssignments.map((assignment) => {
            const project = getProject(assignment.project_id);
            const startDate = new Date(assignment.start_date);
            const endDate = new Date(assignment.end_date);
            const isActive = new Date() >= startDate && new Date() <= endDate;
            
            return (
              <Card key={assignment.id} className={isActive ? 'ring-2 ring-blue-200' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <span>{project?.name}</span>
                      {isActive && <Badge variant="default">Active</Badge>}
                    </CardTitle>
                    <Badge variant="secondary" className="text-lg font-semibold">
                      {assignment.allocation_percentage}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="font-medium">{assignment.role}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Project Status</p>
                      <Badge variant={project?.status === 'active' ? 'default' : 'secondary'}>
                        {project?.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Start Date</p>
                        <p className="text-sm">{assignment.start_date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">End Date</p>
                        <p className="text-sm">{assignment.end_date}</p>
                      </div>
                    </div>
                  </div>
                  
                  {project?.description && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500">Project Description</p>
                      <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                    </div>
                  )}
                  
                  {project?.required_skills && project.required_skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 mb-2">Required Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {project.required_skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyAssignments;
