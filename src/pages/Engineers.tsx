
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const Engineers: React.FC = () => {
  const { engineers, assignments } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredEngineers = engineers.filter(engineer =>
    engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engineer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          const engineerAssignments = assignments.filter(a => a.engineerId === engineer.id);
          
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
                    {engineer.skills.map((skill) => (
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
                      {capacity.allocated}% / {engineer.maxCapacity}%
                    </p>
                  </div>
                  <Progress 
                    value={(capacity.allocated / engineer.maxCapacity) * 100} 
                    className="h-2"
                  />
                  {capacity.allocated > engineer.maxCapacity && (
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
