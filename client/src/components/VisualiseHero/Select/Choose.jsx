import React, { useState } from 'react';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Choose({ onGenerateGrid }) {
  const [algorithm, setAlgorithm] = useState('');
  const [gridSize, setGridSize] = useState('');
  const [error, setError] = useState('');

  const handleGenerateGrid = () => {
    const size = parseInt(gridSize);
    if (size < 2|| size > 25) {
      setError('Grid size must be between 2 and 25');
      return;
    }
    setError('');
    if (onGenerateGrid && gridSize) {
      onGenerateGrid(algorithm, size);
    }
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 shadow-2xl w-full max-w-3xl mx-auto">
      <div className="flex flex-col items-center justify-center gap-4">
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
            helperText={error}
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

