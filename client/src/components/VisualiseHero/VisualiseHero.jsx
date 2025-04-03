import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Grid from './Grid/Grid';
import Choose from './Select/Choose';

function VisualiseHero() {
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
    setGridSize(parseInt(size));
    setShowGrid(true);
  };

  return (
    <div className="min-h-screen relative">
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to the Dijkstra Algorithm Visualizer</h1>
        </div>
        <div className="flex justify-center">
          <Choose onGenerateGrid={handleGenerateGrid} />
        </div>
        {showGrid && gridSize > 0 && (
          <div className="mt-8">
            <Grid gridSize={gridSize} />
          </div>
        )}
        <div className="text-center py-8">
          <p className="text-lg text-gray-300">
            The algorithm will then find the shortest path between the start and end points, 
            and you can see the process step by step.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VisualiseHero;
