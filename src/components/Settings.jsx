import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../slices/uiSlice';
import { logout } from '../slices/authSlice';
import {
  MoonIcon,
  SunIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'; // Ensure @heroicons/react is installed

const Settings = ({ onLogout }) => {
  const darkMode = useSelector(state => state.ui.darkMode);
  const dispatch = useDispatch();

  return (
    <div className="p-6 max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-8 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center">Settings</h2>

      <button
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition ring-1 ring-transparent focus:ring-blue-500"
        onClick={() => dispatch(toggleDarkMode())}
      >
        {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>

      <button
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold transition ring-1 ring-transparent focus:ring-red-400"
        onClick={() => {
          dispatch(logout());
          if (onLogout) onLogout();
        }}
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5" />
        Logout
      </button>
    </div>
  );
};

export default Settings;
