import React, { useState } from 'react';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Choose({ onGenerateGrid }) {
  const [algorithm, setAlgorithm] = useState('dijkstra');
  const [gridSize, setGridSize] = useState('');
  const [error, setError] = useState('');

  const handleGenerateGrid = () => {
    const size = parseInt(gridSize);
    if (size < 2 || size > 25) {
      setError('Grid size must be between 2 and 25');
      return;
    }
    setError('');
    if (onGenerateGrid && gridSize) {
      onGenerateGrid(algorithm, size);
    }
  };

  return (    <div className="grid-container w-full max-w-3xl mx-auto">
      <div className="flex flex-col items-center justify-center gap-4">        <FormControl sx={{ 
          width: '100%',
          maxWidth: '300px',
          '& .MuiOutlinedInput-root': {
            color: theme => theme.palette.mode === 'light' ? '#1f2937' : 'white',
            '& fieldset': { 
              borderColor: theme => theme.palette.mode === 'light' ? 'rgba(99, 102, 241, 0.23)' : 'rgba(255, 255, 255, 0.23)' 
            },
            '&:hover fieldset': { 
              borderColor: theme => theme.palette.mode === 'light' ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.5)' 
            },
          },
          '& .MuiSelect-select': {
            color: theme => theme.palette.mode === 'light' ? '#1f2937' : 'white',
          },
          '& .MuiInputLabel-root': { 
            color: theme => theme.palette.mode === 'light' ? '#4b5563' : 'rgba(255, 255, 255, 0.7)'
          }
        }}>
          <InputLabel id="algorithm-select-label">Algorithm</InputLabel>          <Select
            labelId="algorithm-select-label"
            id="algorithm-select"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            displayEmpty
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgb(17, 24, 39)' : 'white',
                  '& .MuiMenuItem-root': {
                    color: theme => theme.palette.mode === 'dark' ? 'white' : '#1f2937'
                  }
                }
              }
            }}
          >
            <MenuItem value="dijkstra">Dijkstra</MenuItem>
            <MenuItem value="bfs">BFS</MenuItem>
            <MenuItem value="dfs">DFS</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ 
          width: '100%',
          maxWidth: '300px',
          '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
          },
          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
        }}>
          <TextField
            id="grid-size-input"
            label="Grid Size"
            variant="outlined"
            value={gridSize}
            onChange={(e) => setGridSize(e.target.value)}
            className="text-white"
            error={!!error}
            helperText={error || ''}
          />
        </FormControl>

        <Button 
          variant="contained"
          onClick={handleGenerateGrid}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600
            transform hover:scale-105 transition-all duration-300 ease-in-out
            px-6 py-2 rounded-lg shadow-lg hover:shadow-xl"
        >
          Generate Grid
        </Button>
      </div>
    </div>
  );
}

