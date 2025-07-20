import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import MapPathFinder from '../VisualiseHero/MapPathFinder';

function Map() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={`min-h-screen relative ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center py-8">
          <h1 className={`text-4xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Map Path Finder
          </h1>
          <p className={`text-lg mb-8 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Find the shortest path between two points on a real-world map using Dijkstra's algorithm.
          </p>
        </div>
        <MapPathFinder />
      </div>
    </div>
  );
}

export default Map;
