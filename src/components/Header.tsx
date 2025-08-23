import React from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="AnomaVision Logo" className="h-16 w-16" />
              <span className="text-xl font-bold text-gray-900">AnomaVision</span>
            </div>

            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <a href="#" className="text-blue-700 font-medium border-b-2 border-blue-700 px-1 py-2">
                Dashboard
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-700">
                <User className="h-4 w-4" />
                <span>{currentUser?.fullName}</span>
                <span className="text-xs text-gray-500">({currentUser?.role})</span>
              </div>

              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
