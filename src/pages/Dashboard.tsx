import React from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, FolderOpen, Calendar, TrendingUp, Activity, Award, Zap, User } from 'lucide-react';
import TeamAnalytics from '@/components/TeamAnalytics';

const Dashboard: React.FC = () => {
  const { currentProfile, profiles, projects, assignments, loading } = useSupabaseData();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce"></div>
          <div className="text-gray-500 text-lg">Loading your dashboard...</div>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  const engineers = profiles.filter(p => p.role === 'engineer');
  const activeProjects = projects.filter(p => p.status === 'active');
  const totalAssignments = assignments.length;

  const getCapacityStats = () => {
    const totalCapacity = engineers.reduce((sum, eng) => sum + (eng.max_capacity || 100), 0);
    const allocatedCapacity = assignments.reduce((sum, assignment) => {
      return sum + assignment.allocation_percentage;
    }, 0);
    return { total: totalCapacity, allocated: allocatedCapacity };
  };

  const capacityStats = getCapacityStats();

  const getSeniorityColor = (seniority: string) => {
    switch (seniority) {
      case 'senior': return 'from-purple-500 to-pink-500';
      case 'mid': return 'from-blue-500 to-cyan-500';
      default: return 'from-green-500 to-emerald-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative inline-block">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-1 animate-pulse">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Activity className="w-8 h-8 text-gray-600" />
              </div>
            </div>
            <div className="absolute -top-2 -right-2 bg-green-500 w-6 h-6 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Welcome back, {currentProfile?.name}!
            </h1>
            <p className="text-gray-600 text-lg">
              {currentProfile?.role === 'manager' ? 'Engineering Team Overview' : 'Your Personal Dashboard'}
            </p>
            <Badge 
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-1"
            >
              {currentProfile?.role} • {currentProfile?.department}
            </Badge>
          </div>
        </div>

        {currentProfile?.role === 'manager' ? (
          <>
            {/* Manager Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Total Engineers',
                  value: engineers.length,
                  icon: Users,
                  color: 'from-blue-500 to-cyan-500',
                  bgColor: 'bg-blue-100',
                  textColor: 'text-blue-600'
                },
                {
                  title: 'Active Projects',
                  value: activeProjects.length,
                  icon: FolderOpen,
                  color: 'from-green-500 to-emerald-500',
                  bgColor: 'bg-green-100',
                  textColor: 'text-green-600'
                },
                {
                  title: 'Total Assignments',
                  value: totalAssignments,
                  icon: Calendar,
                  color: 'from-purple-500 to-pink-500',
                  bgColor: 'bg-purple-100',
                  textColor: 'text-purple-600'
                },
                {
                  title: 'Team Capacity',
                  value: `${Math.round((capacityStats.allocated / capacityStats.total) * 100)}%`,
                  icon: TrendingUp,
                  color: 'from-orange-500 to-red-500',
                  bgColor: 'bg-orange-100',
                  textColor: 'text-orange-600'
                }
              ].map((stat, index) => (
                <Card 
                  key={stat.title} 
                  className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in transform hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Team Analytics */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl">Team Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <TeamAnalytics profiles={profiles} assignments={assignments} />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Engineer Personal Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'My Assignments',
                  value: assignments.filter(a => a.engineer_id === user?.id).length,
                  icon: Calendar,
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  title: 'Current Allocation',
                  value: `${assignments.filter(a => a.engineer_id === user?.id).reduce((sum, a) => sum + a.allocation_percentage, 0)}%`,
                  icon: Activity,
                  color: 'from-green-500 to-emerald-500'
                },
                {
                  title: 'Skills Count',
                  value: currentProfile?.skills?.length || 0,
                  icon: Award,
                  color: 'from-purple-500 to-pink-500'
                }
              ].map((stat, index) => (
                <Card 
                  key={stat.title} 
                  className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in transform hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* My Current Assignments */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl">My Current Assignments</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  {assignments.filter(a => a.engineer_id === user?.id).map((assignment, index) => {
                    const project = projects.find(p => p.id === assignment.project_id);
                    return (
                      <div 
                        key={assignment.id} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900">{project?.name}</p>
                          <p className="text-sm text-gray-500">{assignment.role}</p>
                        </div>
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                          {assignment.allocation_percentage}%
                        </Badge>
                      </div>
                    );
                  })}
                  {assignments.filter(a => a.engineer_id === user?.id).length === 0 && (
                    <div className="text-center py-12">
                      <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No current assignments</p>
                      <p className="text-sm text-gray-400">You're available for new projects!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
