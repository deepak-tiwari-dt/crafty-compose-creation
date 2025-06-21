
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TeamAnalyticsProps {
  profiles: any[];
  assignments: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const TeamAnalytics: React.FC<TeamAnalyticsProps> = ({ profiles, assignments }) => {
  const engineers = profiles.filter(p => p.role === 'engineer');

  // Calculate capacity utilization data
  const capacityData = engineers.map(engineer => {
    const engineerAssignments = assignments.filter(a => a.engineer_id === engineer.id);
    const totalAllocated = engineerAssignments.reduce((sum, a) => sum + a.allocation_percentage, 0);
    
    return {
      name: engineer.name.split(' ')[0], // First name only for chart
      allocated: totalAllocated,
      available: (engineer.max_capacity || 100) - totalAllocated,
      maxCapacity: engineer.max_capacity || 100
    };
  });

  // Calculate skills distribution
  const skillsMap = new Map();
  engineers.forEach(engineer => {
    engineer.skills?.forEach((skill: string) => {
      skillsMap.set(skill, (skillsMap.get(skill) || 0) + 1);
    });
  });

  const skillsData = Array.from(skillsMap.entries())
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 skills

  // Calculate seniority distribution
  const seniorityMap = new Map();
  engineers.forEach(engineer => {
    const seniority = engineer.seniority || 'junior';
    seniorityMap.set(seniority, (seniorityMap.get(seniority) || 0) + 1);
  });

  const seniorityData = Array.from(seniorityMap.entries()).map(([level, count]) => ({
    name: level.charAt(0).toUpperCase() + level.slice(1),
    value: count
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Capacity Utilization Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Team Capacity Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={capacityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="allocated" fill="#3b82f6" name="Allocated %" />
              <Bar dataKey="available" fill="#10b981" name="Available %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Seniority Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Team Seniority Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={seniorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {seniorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Top Skills in Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillsData.map((skill, index) => (
              <div key={skill.skill} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{skill.skill}</Badge>
                  <span className="text-sm text-gray-600">
                    {skill.count} engineer{skill.count > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(skill.count / engineers.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Team Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{engineers.length}</p>
              <p className="text-sm text-gray-600">Total Engineers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {Math.round(capacityData.reduce((sum, eng) => sum + eng.available, 0) / engineers.length)}%
              </p>
              <p className="text-sm text-gray-600">Avg Available</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{skillsMap.size}</p>
              <p className="text-sm text-gray-600">Unique Skills</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{assignments.length}</p>
              <p className="text-sm text-gray-600">Active Assignments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamAnalytics;
