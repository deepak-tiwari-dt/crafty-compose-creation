
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, FolderOpen, Calendar, User, LogOut, Building, Activity } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { currentProfile } = useSupabaseData();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
  };

  if (!user || !currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce mx-auto"></div>
          <div className="space-y-2">
            <p className="text-xl text-gray-600">Loading your workspace...</p>
            <div className="flex space-x-2 justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navigation = currentProfile.role === 'manager' 
    ? [
        { name: 'Dashboard', href: '/', icon: Activity, color: 'hover:text-blue-600' },
        { name: 'Engineers', href: '/engineers', icon: Users, color: 'hover:text-green-600' },
        { name: 'Projects', href: '/projects', icon: FolderOpen, color: 'hover:text-purple-600' },
        { name: 'Assignments', href: '/assignments', icon: Calendar, color: 'hover:text-pink-600' },
      ]
    : [
        { name: 'My Dashboard', href: '/', icon: Activity, color: 'hover:text-blue-600' },
        { name: 'My Assignments', href: '/my-assignments', icon: Calendar, color: 'hover:text-purple-600' },
        { name: 'Profile', href: '/profile', icon: User, color: 'hover:text-green-600' },
      ];

  const getSeniorityColor = (seniority: string) => {
    switch (seniority) {
      case 'senior': return 'from-purple-500 to-pink-500';
      case 'mid': return 'from-blue-500 to-cyan-500';
      default: return 'from-green-500 to-emerald-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <nav className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    ERM System
                  </h1>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href || 
                    (item.href === '/' && location.pathname === '/');
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md'
                          : `text-gray-600 hover:bg-white/50 ${item.color}`
                      }`}
                    >
                      <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-600' : ''}`} />
                      <span>{item.name}</span>
                      {isActive && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {currentProfile.name}
                    </span>
                    <Badge 
                      className={`bg-gradient-to-r ${getSeniorityColor(currentProfile.seniority)} text-white border-0 text-xs`}
                    >
                      {currentProfile.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{currentProfile.department}</p>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-r ${getSeniorityColor(currentProfile.seniority)} rounded-full p-0.5`}>
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="group p-2 hover:bg-red-50 hover:text-red-600 transition-all duration-300 rounded-xl"
              >
                <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="sr-only">Sign out</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
