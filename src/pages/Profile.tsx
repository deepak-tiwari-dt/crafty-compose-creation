
import React, { useState } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Profile: React.FC = () => {
  const { currentProfile, refetch } = useSupabaseData();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentProfile?.name || '',
    department: currentProfile?.department || '',
    skills: currentProfile?.skills?.join(', ') || '',
    seniority: currentProfile?.seniority || 'junior' as 'junior' | 'mid' | 'senior',
    max_capacity: currentProfile?.max_capacity || 100
  });

  const handleSave = async () => {
    try {
      const skillsArray = profileData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          department: profileData.department,
          skills: skillsArray,
          seniority: profileData.seniority,
          max_capacity: profileData.max_capacity
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    }
  };

  if (!currentProfile) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and skills</p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{currentProfile.name}</p>
              )}
            </div>
            
            <div>
              <Label>Email</Label>
              <p className="text-gray-600">{currentProfile.email}</p>
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              {isEditing ? (
                <Input
                  id="department"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                />
              ) : (
                <p>{currentProfile.department}</p>
              )}
            </div>

            <div>
              <Label>Role</Label>
              <Badge variant="secondary">{currentProfile.role}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="seniority">Seniority Level</Label>
              {isEditing ? (
                <Select 
                  value={profileData.seniority} 
                  onValueChange={(value: 'junior' | 'mid' | 'senior') => 
                    setProfileData({ ...profileData, seniority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="mid">Mid</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant={currentProfile.seniority === 'senior' ? 'default' : currentProfile.seniority === 'mid' ? 'secondary' : 'outline'}>
                  {currentProfile.seniority}
                </Badge>
              )}
            </div>

            <div>
              <Label htmlFor="capacity">Maximum Capacity (%)</Label>
              {isEditing ? (
                <Input
                  id="capacity"
                  type="number"
                  min="50"
                  max="100"
                  value={profileData.max_capacity}
                  onChange={(e) => setProfileData({ ...profileData, max_capacity: parseInt(e.target.value) })}
                />
              ) : (
                <p>{currentProfile.max_capacity}%</p>
              )}
            </div>

            <div>
              <Label htmlFor="skills">Skills</Label>
              {isEditing ? (
                <Input
                  id="skills"
                  value={profileData.skills}
                  onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                  placeholder="React, Node.js, Python (comma-separated)"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {currentProfile.skills?.map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isEditing && (
        <div className="mt-6 flex space-x-4">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
