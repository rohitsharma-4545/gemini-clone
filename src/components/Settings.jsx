import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../slices/uiSlice';
import { logout } from '../slices/authSlice';
import {
  MoonIcon,
  SunIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Settings = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const darkMode = useSelector(state => state.ui.darkMode);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
    setIsOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    if (onLogout) onLogout();
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="settings-dropdown">
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm text-gray-700 dark:text-gray-300">Settings</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-50" style={{ width: '12rem' }}>

          {/* Dark Mode Toggle */}
          <button
            onClick={handleDarkModeToggle}
            className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <span className="flex items-center gap-2">
              {darkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
            <div className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-200 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </div>
          </button>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;