import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useTheme } from '../../../context/ThemeContext';

const algorithms = {
  dijkstra: {
    name: 'Dijkstra\'s Algorithm',
    description: 'Finds the shortest path between two nodes in a graph, using a priority queue to explore the nearest nodes first.',
    properties: ['Complete', 'Optimal', 'Time: O(E + V log V)', 'Space: O(V)'],
  },
  bfs: {
    name: 'Breadth-First Search',
    description: 'Explores all neighbors at the present depth prior to moving on to nodes at the next depth level.',
    properties: ['Complete', 'Optimal for unweighted grids', 'Time: O(V + E)', 'Space: O(V)'],
  },
  dfs: {
    name: 'Depth-First Search',
    description: 'Explores as far as possible along each branch before backtracking.',
    properties: ['Complete', 'Not optimal', 'Time: O(V + E)', 'Space: O(V)'],
  },
};

export default function Choose({ onGenerateGrid }) {
  const [algorithm, setAlgorithm] = useState('dijkstra');
  const [gridSize, setGridSize] = useState('');
  const [error, setError] = useState('');
  const { theme } = useTheme();

  const handleGridSizeChange = (e) => {
    setGridSize(e.target.value);
    setError('');
  };

  const handleGenerateGrid = () => {
    if (!gridSize) {
      setError('Please enter a grid size');
      return;
    }
    const size = parseInt(gridSize);
    if (isNaN(size) || size < 2 || size > 25) {
      setError('Grid size must be between 2 and 25');
      return;
    }
    onGenerateGrid(algorithm, size);
  };

  return (    
    <div className="grid-container w-full max-w-3xl mx-auto">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex gap-4 w-full max-w-md justify-center">
          {Object.entries(algorithms).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setAlgorithm(key)}
              className={`
                flex-1 px-4 py-3 rounded-lg transition-all duration-300
                ${algorithm === key 
                  ? theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-gradient-to-r from-indigo-300 to-indigo-400 text-white shadow-lg shadow-indigo-500/30'
                  : theme === 'dark'
                    ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white'
                    : 'bg-white hover:bg-indigo-50 text-gray-600 hover:text-indigo-600'
                }
                border
                ${algorithm === key
                  ? theme === 'dark' 
                    ? 'border-purple-500'
                    : 'border-indigo-300'
                  : theme === 'dark'
                    ? 'border-gray-700 hover:border-purple-500/50'
                    : 'border-gray-200 hover:border-indigo-300'
                }
                transform hover:scale-105 backdrop-blur-sm
              `}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
        <div className={`w-full max-w-md p-4 rounded-lg border ${
          theme === 'dark'
            ? 'bg-gray-800/30 border-purple-500/20 text-white'
            : 'bg-white border-indigo-200 text-gray-800'
        } backdrop-blur-sm`}>
          <h3 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            {algorithms[algorithm].name}
          </h3>
          <p className={`mb-3 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {algorithms[algorithm].description}
          </p>
          <div className="flex flex-wrap gap-2">
            {algorithms[algorithm].properties.map((prop, index) => (
              <span 
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  theme === 'dark'
                    ? 'bg-purple-900/40 text-purple-200 border border-purple-500/20'
                    : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                }`}
              >
                {prop}
              </span>
            ))}
          </div>
        </div>

        <div style={{ 
          width: '100%',
          maxWidth: '300px',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.23)',
          borderRadius: '4px',
          padding: '8px',
          marginBottom: '16px'
        }}>
          <TextField
            id="grid-size-input"
            label="Grid Size"
            variant="outlined"
            value={gridSize}
            onChange={handleGridSizeChange}
            error={!!error}
            helperText={error || ''}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#9c27b0',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#9c27b0',
                },
              },
              '& .MuiFormHelperText-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
        </div>

        <button 
          onClick={handleGenerateGrid}
          className={`
            w-full max-w-md px-6 py-2 text-white font-medium
            bg-gradient-to-r from-purple-500 to-indigo-500 
            hover:from-purple-600 hover:to-indigo-600
            transform hover:scale-105 transition-all duration-300 ease-in-out
            rounded-lg shadow-lg hover:shadow-xl
            ${theme === 'dark' 
              ? 'bg-opacity-90 hover:bg-opacity-100' 
              : 'bg-opacity-80 hover:bg-opacity-90'
            }
          `}
        >
          Generate Grid
        </button>
      </div>
    </div>
  );
}

