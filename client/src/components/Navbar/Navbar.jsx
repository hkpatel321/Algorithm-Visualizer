import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Logout from '../Auth/Logout';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-gray-900/60 backdrop-blur-md border-b border-purple-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                PathFinder
              </span>
            </div>
            
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/visualize')}
                  className="text-gray-300 hover:bg-purple-800/40 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300">
                  Visualize
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-300 hover:bg-purple-800/40 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300">
                  Dashboard
                </button>
               
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => navigate('/chat')}
              className="text-gray-300 hover:bg-purple-800/40 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300">
              Chat
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-purple-800/40 transition-all duration-300"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4"> 
                <span className="text-gray-300">Logged in as {user?.name}</span> {/* Use optional chaining */}
                <Logout />
              </div>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-gray-300 hover:bg-purple-800/40 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300">
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="text-purple-400 border border-purple-400 hover:bg-purple-800/40 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300">
                  Sign Up
                </button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button 
              onClick={() => navigate('/visualize')}
              className="text-gray-300 hover:bg-purple-800/40 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">
              Visualize
            </button>
            <button 
              onClick={() => navigate('/chat')}
              className="text-gray-300 hover:bg-purple-800/40 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">
              Chat
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-gray-300 hover:bg-purple-800/40 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">
              Dashboard
            </button>
            {isAuthenticated ? (
              <>
                <span className="text-gray-300">Logged in as {user?.name}</span> {/* Use optional chaining */}
                <Logout />
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-gray-300 hover:bg-purple-800/40 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="text-purple-400 hover:bg-purple-800/40 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
