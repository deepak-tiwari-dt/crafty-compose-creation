
import React, { useState } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search, Award, Activity, Mail, Building, Zap } from 'lucide-react';

const Engineers: React.FC = () => {
  const { profiles, assignments, loading } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');

  const engineers = profiles.filter(p => p.role === 'engineer');

  const getEngineerCapacity = (engineerId: string) => {
    const engineer = engineers.find(e => e.id === engineerId);
    if (!engineer) return { allocated: 0, available: 100 };
    
    const engineerAssignments = assignments.filter(a => a.engineer_id === engineerId);
    const totalAllocated = engineerAssignments.reduce((sum, a) => sum + a.allocation_percentage, 0);
    
    return {
      allocated: totalAllocated,
      available: (engineer.max_capacity || 100) - totalAllocated
    };
  };

  const filteredEngineers = engineers.filter(engineer =>
    engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engineer.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <div className="text-gray-500 text-lg">Loading engineers...</div>
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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-1 animate-pulse">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-600" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-gray-100">
              <Award className="w-4 h-4 text-yellow-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Engineering Team
            </h1>
            <p className="text-gray-600 text-lg">Manage your talented engineering team</p>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-1">
              {engineers.length} Engineers
            </Badge>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search engineers by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-0 shadow-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        {/* Engineers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEngineers.map((engineer, index) => {
            const capacity = getEngineerCapacity(engineer.id);
            const engineerAssignments = assignments.filter(a => a.engineer_id === engineer.id);
            
            return (
              <Card 
                key={engineer.id} 
                className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getSeniorityColor(engineer.seniority)} rounded-full p-1`}>
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                          <Activity className="w-6 h-6 text-gray-600" />
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{engineer.name}</CardTitle>
                        <Badge 
                          className={`bg-gradient-to-r ${getSeniorityColor(engineer.seniority)} text-white border-0 text-xs`}
                        >
                          {engineer.seniority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6 pt-6">
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>{engineer.department}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{engineer.email}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-medium text-gray-700">Skills</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {engineer.skills?.slice(0, 4).map((skill, idx) => (
                        <Badge 
                          key={skill} 
                          variant="outline" 
                          className="text-xs hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 animate-fade-in"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          {skill}
                        </Badge>
                      ))}
                      {engineer.skills && engineer.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs text-gray-500">
                          +{engineer.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">Capacity</p>
                      <p className="text-sm text-gray-500">
                        {capacity.allocated}% / {engineer.max_capacity}%
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Progress 
                        value={(capacity.allocated / (engineer.max_capacity || 100)) * 100} 
                        className="h-3"
                      />
                      {capacity.allocated > (engineer.max_capacity || 100) && (
                        <p className="text-xs text-red-600 font-medium animate-pulse">⚠️ Overallocated</p>
                      )}
                    </div>
                  </div>

                  {/* Current Assignments */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">Current Projects</p>
                      <Badge variant="secondary" className="text-xs">
                        {engineerAssignments.length}
                      </Badge>
                    </div>
                    {engineerAssignments.length > 0 ? (
                      <div className="space-y-1">
                        {engineerAssignments.slice(0, 2).map((assignment) => (
                          <div key={assignment.id} className="text-xs text-gray-600">
                            • {assignment.role} ({assignment.allocation_percentage}%)
                          </div>
                        ))}
                        {engineerAssignments.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{engineerAssignments.length - 2} more assignments
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Available for projects</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredEngineers.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">No engineers found</p>
            <p className="text-gray-400">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Engineers;
