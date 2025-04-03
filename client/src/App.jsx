import React, { useState } from 'react'

function App() {
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(0);

  const handleGenerateGrid = (algorithm, size) => {
    setGridSize(parseInt(size));
    setShowGrid(true);
  };

  return null; 
}

export default App;
