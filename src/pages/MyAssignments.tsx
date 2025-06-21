
import React from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, User, Activity, Zap, Target, Award, FolderOpen } from 'lucide-react';

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

  const getSeniorityColor = (seniority: string) => {
    switch (seniority) {
      case 'senior': return 'from-purple-500 to-pink-500';
      case 'mid': return 'from-blue-500 to-cyan-500';
      default: return 'from-green-500 to-emerald-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce"></div>
          <div className="text-gray-500 text-lg">Loading your assignments...</div>
          <div className="space-y-4 w-96">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative inline-block">
            <div className={`w-20 h-20 bg-gradient-to-r ${getSeniorityColor(currentProfile?.seniority || 'junior')} rounded-full p-1 animate-pulse`}>
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-gray-600" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-gray-100">
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              My Assignments
            </h1>
            <p className="text-gray-600 text-lg">Your current and upcoming project assignments</p>
            <div className="flex items-center justify-center space-x-2">
              <Badge 
                className={`bg-gradient-to-r ${getSeniorityColor(currentProfile?.seniority || 'junior')} text-white border-0`}
              >
                {currentProfile?.seniority} {currentProfile?.role}
              </Badge>
              <Badge variant="secondary">
                {myAssignments.length} assignments
              </Badge>
            </div>
          </div>
        </div>

        {/* Capacity Overview */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl">Capacity Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Total Allocation',
                  value: `${getTotalAllocation()}%`,
                  icon: Target,
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-100'
                },
                {
                  title: 'Available Capacity',
                  value: `${getAvailableCapacity()}%`,
                  icon: Award,
                  color: 'text-green-600',
                  bgColor: 'bg-green-100'
                },
                {
                  title: 'Max Capacity',
                  value: `${currentProfile?.max_capacity}%`,
                  icon: Activity,
                  color: 'text-purple-600',
                  bgColor: 'bg-purple-100'
                }
              ].map((stat, index) => (
                <div 
                  key={stat.title} 
                  className="text-center space-y-4 animate-fade-in"
                  style={{ animationDelay: `${(index + 3) * 100}ms` }}
                >
                  <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Workload Distribution</p>
                <p className="text-sm text-gray-500">
                  {getTotalAllocation()}% of {currentProfile?.max_capacity}%
                </p>
              </div>
              <div className="relative">
                <Progress 
                  value={(getTotalAllocation() / (currentProfile?.max_capacity || 100)) * 100} 
                  className="h-4"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
              {getTotalAllocation() > (currentProfile?.max_capacity || 100) && (
                <p className="text-sm text-red-600 font-medium animate-pulse">⚠️ You are over capacity!</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Assignments */}
        <div className="space-y-6">
          <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h2 className="text-2xl font-bold text-gray-900">Current Assignments</h2>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {myAssignments.length} {myAssignments.length === 1 ? 'project' : 'projects'}
            </Badge>
          </div>
          
          {myAssignments.length === 0 ? (
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in">
              <CardContent className="py-16 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-6 animate-bounce" />
                <p className="text-xl text-gray-500 mb-2">No current assignments</p>
                <p className="text-gray-400">You're available for new projects!</p>
                <div className="mt-8 inline-flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 font-medium">Available</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {myAssignments.map((assignment, index) => {
                const project = getProject(assignment.project_id);
                const startDate = new Date(assignment.start_date);
                const endDate = new Date(assignment.end_date);
                const isActive = new Date() >= startDate && new Date() <= endDate;
                
                return (
                  <Card 
                    key={assignment.id} 
                    className={`group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in transform hover:scale-[1.02] ${isActive ? 'ring-2 ring-blue-200' : ''}`}
                    style={{ animationDelay: `${(index + 5) * 100}ms` }}
                  >
                    <CardHeader className="border-b border-gray-100 pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1">
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                              <FolderOpen className="w-7 h-7 text-gray-600" />
                            </div>
                          </div>
                          <div>
                            <span className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                              {project?.name}
                            </span>
                            <div className="flex items-center space-x-2 mt-1">
                              {isActive && <Badge variant="default" className="animate-pulse">Active</Badge>}
                              <Badge variant="outline">{assignment.role}</Badge>
                            </div>
                          </div>
                        </CardTitle>
                        <Badge 
                          variant="secondary" 
                          className="text-2xl font-bold px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700"
                        >
                          {assignment.allocation_percentage}%
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-gray-500" />
                            <p className="text-sm font-medium text-gray-700">Project Status</p>
                          </div>
                          <Badge 
                            variant={project?.status === 'active' ? 'default' : 'secondary'}
                            className="text-sm px-3 py-1"
                          >
                            {project?.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <p className="text-sm font-medium text-gray-700">Start Date</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{assignment.start_date}</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <p className="text-sm font-medium text-gray-700">End Date</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{assignment.end_date}</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4 text-gray-500" />
                            <p className="text-sm font-medium text-gray-700">Team Size</p>
                          </div>
                          <Badge variant="outline" className="text-sm">
                            {project?.team_size} members
                          </Badge>
                        </div>
                      </div>
                      
                      {project?.description && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm font-medium text-gray-700 mb-2">Project Description</p>
                          <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
                        </div>
                      )}
                      
                      {project?.required_skills && project.required_skills.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                            <Zap className="w-4 h-4" />
                            <span>Required Skills</span>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.required_skills.map((skill, idx) => (
                              <Badge 
                                key={skill} 
                                variant="outline" 
                                className="text-xs hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 animate-fade-in"
                                style={{ animationDelay: `${idx * 50}ms` }}
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAssignments;
