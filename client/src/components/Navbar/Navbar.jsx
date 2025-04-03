import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logout from '../Auth/Logout';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); 

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
