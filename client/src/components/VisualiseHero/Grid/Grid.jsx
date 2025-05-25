import React, { useState, useEffect } from 'react';
import { dijkstra, getNodesInShortestPathOrder, animateDijkstra } from '../../../utils/Dijkstra';
import bfs from '../../../utils/BFS';
import dfs from '../../../utils/DFS';

function Grid({ gridSize, algorithm }) {
  const [grid, setGrid] = useState([]);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [isSelectingStart, setIsSelectingStart] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(50); // Default speed (milliseconds)

  const resetGrid = () => {
    const nodes = document.getElementsByClassName('grid-node');
    Array.from(nodes).forEach(node => {
      node.style.backgroundColor = '';
      node.style.transition = '';
    });
  };

  useEffect(() => {
    resetGrid();
    setGrid(createGrid(gridSize));
    setStartNode(null);
    setEndNode(null);
    setIsSelectingStart(true);
  }, [gridSize]);

  function createGrid(size) {
    const newGrid = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push({
          row: i,
          col: j,
          distance: Infinity,
          isVisited: false,
          isStart: false,
          isEnd: false,
          weight: Math.floor(Math.random() * 999) + 1,
          previousNode: null,
          bgClass: getBackgroundClass(size)
        });
      }
      newGrid.push(row);
    }
    return newGrid;
  }

  const handleCellClick = (row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];

    if (isSelectingStart) {
      if (startNode) {
        newGrid[startNode.row][startNode.col].isStart = false;
      }
      node.isStart = true;
      setStartNode(node);
      setIsSelectingStart(false);
      alert('Choose end node');
    } else {
      if (endNode) {
        newGrid[endNode.row][endNode.col].isEnd = false;
      }
      node.isEnd = true;
      setEndNode(node);
      setIsSelectingStart(true);
      alert('Running Algorithm');
      let visitedNodesInOrder;
      switch (algorithm) {
        case 'bfs':
          visitedNodesInOrder = bfs(newGrid, startNode, node);
          break;
        case 'dfs':
          visitedNodesInOrder = dfs(newGrid, startNode, node);
          break;
        default:
          visitedNodesInOrder = dijkstra(newGrid, startNode, node);
      }
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(node);
      console.log(`visitedNodesInOrder: ${visitedNodesInOrder}`);
      console.log(`nodesInShortestPathOrder: ${nodesInShortestPathOrder}`);
      animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, animationSpeed);
    }

    setGrid(newGrid);
  };

  const getBackgroundClass = (size) => {
    if (size <= 10) return 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800';
    if (size <= 20) return 'bg-gradient-to-br from-blue-900 via-green-900 to-teal-800';
    return 'bg-gradient-to-br from-red-900 via-orange-900 to-yellow-800';
  };

  const clearBoard = () => {
    resetGrid();
    const newGrid = createGrid(gridSize);
    setGrid(newGrid);
    setStartNode(null);
    setEndNode(null);
    setIsSelectingStart(true);
  };

  const clearPath = () => {
    const nodes = document.getElementsByClassName('grid-node');
    Array.from(nodes).forEach(node => {
      if (!node.classList.contains('bg-gradient-to-r')) {
        node.style.backgroundColor = '';
        node.style.transition = '';
      }
    });

    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        distance: Infinity,
        isVisited: false,
        previousNode: null
      }))
    );
    setGrid(newGrid);
  };

  const deleteGrid = () => {
    setGrid([]);
    setStartNode(null);
    setEndNode(null);
    setIsSelectingStart(true);
  };

  const visualizeAlgorithm = () => {
    if (!startNode || !endNode) {
      alert('Please select both a start and an end node.');
      return;
    }

    let visitedNodesInOrder;
    switch (algorithm) {
      case 'bfs':
        visitedNodesInOrder = bfs(grid, startNode, endNode);
        break;
      case 'dfs':
        visitedNodesInOrder = dfs(grid, startNode, endNode);
        break;
      default:
        visitedNodesInOrder = dijkstra(grid, startNode, endNode);
    }

    const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, animationSpeed);
  };

  return (    <div className="grid-container max-w-max mx-auto">
      <div className="flex flex-col items-center gap-4 mb-4">
        <div className="flex justify-center gap-4">
          <button
            onClick={clearBoard}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg 
                     transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Clear Board
          </button>
          <button
            onClick={clearPath}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg 
                     transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Clear Path
          </button>
          <button
            onClick={deleteGrid}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg 
                     transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Delete Grid
          </button>
        </div>
        
        <div className="flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-lg">
          <span className="text-gray-300 text-sm">Slow</span>
          <input
            type="range"
            min="10"
            max="100"
            value={100 - animationSpeed}
            onChange={(e) => setAnimationSpeed(100 - e.target.value)}
            className="w-32 h-2 bg-purple-500 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-gray-300 text-sm">Fast</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div
          className="grid gap-1 mx-auto"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            maxWidth: `${Math.min(gridSize * 60, 1200)}px`
          }}
        >
          {grid.map((row, i) => (
            row.map((node, j) => (
              <div
                key={`${i}-${j}`}
                id={`node-${i}-${j}`}
                className={`
                  grid-node p-3 rounded-lg transition-all duration-300 ease-in-out
                  text-center text-sm font-medium
                  ${node.isStart ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' : ''}
                  ${node.isEnd ? 'bg-gradient-to-r from-red-400 to-red-500 text-white' : ''}
                  ${!node.isStart && !node.isEnd ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300' : ''}
                  transform hover:scale-105 cursor-pointer
                  shadow-lg hover:shadow-xl
                `}
                style={{
                  backgroundColor: '',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleCellClick(i, j)}
              >
                {node.weight}
              </div>
            ))
          ))}
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={visualizeAlgorithm}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Visualize {algorithm.toUpperCase()}
        </button>
      </div>
    </div>
  );
}

export default Grid;
