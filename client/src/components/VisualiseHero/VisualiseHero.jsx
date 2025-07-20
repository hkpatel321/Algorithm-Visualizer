import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Grid from './Grid/Grid';
import Choose from './Select/Choose';
import MapPathFinder from './MapPathFinder.jsx';

function VisualiseHero() {
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(0);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('dijkstra');
  const { theme } = useTheme(); 
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleGenerateGrid = (algorithm, size) => {
    if (!isAuthenticated) {
      alert('Please login to use the algorithm visualizer');
      navigate('/login');
      return;
    }
    setSelectedAlgorithm(algorithm);
    setGridSize(parseInt(size));
    setShowGrid(true);
  };

  return (
    <div className={`min-h-screen relative ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}> {/* Theme-aware styling */}
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center py-8">
          <h1 className={`text-4xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Welcome to the  Algorithm Visualizer
          </h1>
        </div>
        <div className="flex justify-center">
          <Choose onGenerateGrid={handleGenerateGrid} currentTheme={theme} />
        </div>
        {showGrid && gridSize > 0 && (
          <div className="mt-8">
            <Grid gridSize={gridSize} algorithm={selectedAlgorithm} />
          </div>
        )}
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-lg mb-4"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? 'Hide Map Path Finder' : 'Find Shortest Path on Map'}
        </button>
        {showMap && <MapPathFinder />}
        <div className="text-center py-8">
          <p className={`text-lg ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            The algorithm will then find the shortest path between the start and end points, 
            and you can see the process step by step.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VisualiseHero;
