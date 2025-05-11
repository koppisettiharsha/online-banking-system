import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle2, Bell, Menu, Shield, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Get user's display name (name if available, otherwise 'Guest')
  const displayName = user?.name || 'Guest';

  return (
    <nav className="bg-blue-600 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">SecureBank</Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/accounts" className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium">Accounts</Link>
              <Link to="/transactions" className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium">Transactions</Link>
              <Link to="/bills" className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium">Bills</Link>
              <Link to="/investments" className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium">Investments</Link>
              <Link to="/loans" className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium">Loans</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                className="p-2 hover:bg-blue-700 rounded-full relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-blue-600"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 text-gray-800 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <a href="#" className="block px-4 py-3 hover:bg-gray-50">
                      <p className="text-sm font-medium">New login detected</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </a>
                    <a href="#" className="block px-4 py-3 hover:bg-gray-50">
                      <p className="text-sm font-medium">Bill payment reminder</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                className="p-2 hover:bg-blue-700 rounded-full flex items-center gap-2"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <UserCircle2 className="h-5 w-5" />
                <span className="hidden md:block text-sm">{displayName}</span>
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 text-gray-800 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Help Center
                  </a>
                  <div className="border-t border-gray-100">
                    <button
                      onClick={signOut}
                      className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="p-2 md:hidden hover:bg-blue-700 rounded-full">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}