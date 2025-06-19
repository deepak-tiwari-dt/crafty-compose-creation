
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Users, FolderOpen, Calendar, User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, setCurrentUser } = useApp();
  const location = useLocation();

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const switchRole = () => {
    if (currentUser?.role === 'manager') {
      setCurrentUser({
        id: '1',
        email: 'john.doe@company.com',
        name: 'John Doe',
        role: 'engineer'
      });
    } else {
      setCurrentUser({
        id: 'manager1',
        email: 'manager@company.com',
        name: 'Alex Manager',
        role: 'manager'
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Engineering Resource Management</h2>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>
          <div className="space-y-4">
            <Button 
              onClick={() => setCurrentUser({
                id: 'manager1',
                email: 'manager@company.com',
                name: 'Alex Manager',
                role: 'manager'
              })}
              className="w-full"
            >
              Sign in as Manager
            </Button>
            <Button 
              onClick={() => setCurrentUser({
                id: '1',
                email: 'john.doe@company.com',
                name: 'John Doe',
                role: 'engineer'
              })}
              variant="outline"
              className="w-full"
            >
              Sign in as Engineer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const navigation = currentUser.role === 'manager' 
    ? [
        { name: 'Dashboard', href: '/', icon: Users },
        { name: 'Engineers', href: '/engineers', icon: User },
        { name: 'Projects', href: '/projects', icon: FolderOpen },
        { name: 'Assignments', href: '/assignments', icon: Calendar },
      ]
    : [
        { name: 'My Dashboard', href: '/', icon: Users },
        { name: 'My Assignments', href: '/my-assignments', icon: Calendar },
        { name: 'Profile', href: '/profile', icon: User },
      ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">ERM System</h1>
              </div>
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {currentUser.name} ({currentUser.role})
                </span>
                <Button
                  onClick={switchRole}
                  variant="outline"
                  size="sm"
                >
                  Switch Role
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
