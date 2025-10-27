import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'SCHOOL_ADMIN': return 'School Admin';
      case 'TEACHER': return 'Teacher';
      case 'PARENT': return 'Parent';
      case 'STUDENT': return 'Student';
      case 'VENDOR': return 'Vendor';
      default: return role;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="/images/edulink.jpg" alt="ZimEduLink" className="h-10 w-auto mr-3" />
            <span className="text-sm bg-blue-500 px-2 py-1 rounded">
              {getRoleDisplayName(user?.role || '')}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
