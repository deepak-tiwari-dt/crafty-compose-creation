
import React, { useState } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Engineers</h1>
        <p className="text-gray-600">Manage your engineering team</p>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search engineers by name or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEngineers.map((engineer) => {
          const capacity = getEngineerCapacity(engineer.id);
          const engineerAssignments = assignments.filter(a => a.engineer_id === engineer.id);
          
          return (
            <Card key={engineer.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{engineer.name}</span>
                  <Badge variant={engineer.seniority === 'senior' ? 'default' : engineer.seniority === 'mid' ? 'secondary' : 'outline'}>
                    {engineer.seniority}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">{engineer.department}</p>
                  <p className="text-sm text-gray-500">{engineer.email}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {engineer.skills?.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Capacity</p>
                    <p className="text-sm text-gray-500">
                      {capacity.allocated}% / {engineer.max_capacity}%
                    </p>
                  </div>
                  <Progress 
                    value={(capacity.allocated / (engineer.max_capacity || 100)) * 100} 
                    className="h-2"
                  />
                  {capacity.allocated > (engineer.max_capacity || 100) && (
                    <p className="text-xs text-red-600 mt-1">Overallocated</p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium">Current Assignments</p>
                  <p className="text-sm text-gray-500">{engineerAssignments.length} active</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Engineers;
