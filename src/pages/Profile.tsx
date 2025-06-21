
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
import { User, Edit3, Save, X, Mail, Building, Award, Zap } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-bounce"></div>
          <div className="text-gray-500">Loading your profile...</div>
        </div>
      </div>
    );
  }

  const getSeniorityColor = (seniority: string) => {
    switch (seniority) {
      case 'senior': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'mid': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-gradient-to-r from-green-500 to-emerald-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section with Animation */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative inline-block">
            <div className={`w-24 h-24 rounded-full ${getSeniorityColor(currentProfile.seniority)} p-1 animate-pulse`}>
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-gray-600" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-gray-100">
              <Award className="w-4 h-4 text-yellow-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {currentProfile.name}
            </h1>
            <p className="text-gray-600 text-lg">{currentProfile.department}</p>
            <div className="flex items-center justify-center space-x-2">
              <Badge variant="secondary" className="text-sm font-medium">
                {currentProfile.role}
              </Badge>
              <Badge 
                className={`text-white ${getSeniorityColor(currentProfile.seniority)} border-0`}
              >
                {currentProfile.seniority}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Save Changes
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information Card */}
          <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900">{currentProfile.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </Label>
                <p className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">{currentProfile.email}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>Department</span>
                </Label>
                {isEditing ? (
                  <Input
                    id="department"
                    value={profileData.department}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                    className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{currentProfile.department}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional Details Card */}
          <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <span>Professional Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="seniority" className="text-sm font-medium text-gray-700">Seniority Level</Label>
                {isEditing ? (
                  <Select 
                    value={profileData.seniority} 
                    onValueChange={(value: 'junior' | 'mid' | 'senior') => 
                      setProfileData({ ...profileData, seniority: value })
                    }
                  >
                    <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Mid</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="inline-block">
                    <Badge className={`text-white ${getSeniorityColor(currentProfile.seniority)} border-0 px-4 py-2`}>
                      {currentProfile.seniority}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-sm font-medium text-gray-700">Maximum Capacity (%)</Label>
                {isEditing ? (
                  <Input
                    id="capacity"
                    type="number"
                    min="50"
                    max="100"
                    value={profileData.max_capacity}
                    onChange={(e) => setProfileData({ ...profileData, max_capacity: parseInt(e.target.value) })}
                    className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${currentProfile.max_capacity}%` }}
                      ></div>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{currentProfile.max_capacity}%</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills" className="text-sm font-medium text-gray-700">Skills & Technologies</Label>
                {isEditing ? (
                  <Input
                    id="skills"
                    value={profileData.skills}
                    onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                    placeholder="React, Node.js, Python (comma-separated)"
                    className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.skills?.map((skill, index) => (
                      <Badge 
                        key={skill} 
                        variant="outline" 
                        className="px-3 py-1 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons for Edit Mode */}
        {isEditing && (
          <div className="flex justify-center space-x-4 animate-fade-in">
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="px-8 py-3 rounded-full border-2 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
