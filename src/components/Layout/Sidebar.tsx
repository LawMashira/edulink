import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    if (!user) return [];

    switch (user.role) {
          case 'SUPER_ADMIN':
            return [
              { name: 'Dashboard', path: '/dashboard', icon: '📊' },
              { name: 'Schools', path: '/schools', icon: '🏫' },
              { name: 'Analytics', path: '/analytics', icon: '📈' },
              { name: 'AI Analytics', path: '/ai-analytics', icon: '🤖' },
              { name: 'Health Management', path: '/health', icon: '🏥' },
              { name: 'Marketplace', path: '/marketplace', icon: '🛒' },
              { name: 'Branding', path: '/branding', icon: '🎨' },
              { name: 'Support', path: '/support', icon: '🆘' }
            ];
      
          case 'SCHOOL_ADMIN':
            return [
              { name: 'Dashboard', path: '/dashboard', icon: '📊' },
              { name: 'Invite Users', path: '/invite', icon: '✉️' },
              { name: 'School Setup', path: '/school-setup', icon: '⚙️' },
              { name: 'Classes', path: '/classes', icon: '👥' },
              { name: 'Teachers', path: '/teachers', icon: '👨‍🏫' },
              { name: 'Students', path: '/students', icon: '👨‍🎓' },
              { name: 'Fees', path: '/fees', icon: '💰' },
              { name: 'Attendance', path: '/attendance', icon: '📋' },
              { name: 'Results', path: '/results', icon: '📊' },
              { name: 'Notices', path: '/notices', icon: '📢' },
              { name: 'AI Analytics', path: '/ai-analytics', icon: '🤖' },
              { name: 'Health Management', path: '/health', icon: '🏥' },
              { name: 'Marketplace', path: '/marketplace', icon: '🛒' },
              { name: 'Branding', path: '/branding', icon: '🎨' }
            ];
      
      case 'TEACHER':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: '📊' },
          { name: 'My Classes', path: '/my-classes', icon: '👥' },
          { name: 'Attendance', path: '/attendance', icon: '📋' },
          { name: 'Marks', path: '/marks', icon: '📝' },
          { name: 'Homework', path: '/homework', icon: '📚' },
          { name: 'Reports', path: '/reports', icon: '📊' },
          { name: 'AI Analytics', path: '/ai-analytics', icon: '🤖' },
          { name: 'Health Management', path: '/health', icon: '🏥' },
          { name: 'Marketplace', path: '/marketplace', icon: '🛒' },
          { name: 'Notices', path: '/notices', icon: '📢' }
        ];
      
      case 'PARENT':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: '📊' },
          { name: 'Child Results', path: '/child-results', icon: '📊' },
          { name: 'Fees', path: '/fees', icon: '💰' },
          { name: 'Attendance', path: '/attendance', icon: '📋' },
          { name: 'Health Management', path: '/health', icon: '🏥' },
          { name: 'Marketplace', path: '/marketplace', icon: '🛒' },
          { name: 'Notices', path: '/notices', icon: '📢' }
        ];
      
      case 'STUDENT':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: '📊' },
          { name: 'My Results', path: '/my-results', icon: '📊' },
          { name: 'Attendance', path: '/attendance', icon: '📋' },
          { name: 'Homework', path: '/homework', icon: '📚' },
          { name: 'Marketplace', path: '/marketplace', icon: '🛒' },
          { name: 'Notices', path: '/notices', icon: '📢' }
        ];

      case 'VENDOR':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: '📊' },
          { name: 'Marketplace', path: '/marketplace', icon: '🛒' }
        ];
      
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-800 text-white w-64">
      <nav className="mt-5 px-2">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
