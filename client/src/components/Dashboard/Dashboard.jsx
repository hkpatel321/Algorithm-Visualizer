import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseUrl';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [grids, setGrids] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedGrid, setSelectedGrid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BaseUrl}/api/chat/dashboard`, { withCredentials: true });
        if (response.data.success) {
          setUserData(response.data.user);
          setGrids(response.data.grids);
          setChatMessages(response.data.chatMessages);
        }
      } catch (error) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleGridSelect = (grid) => {
    setSelectedGrid(grid);
  };

  const renderGridPreview = (gridData) => {
    return (
      <div className="grid grid-cols-10 gap-0.5 bg-gray-800 p-2 rounded-lg">
        {gridData.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-4 h-4 ${
                cell.isStart ? 'bg-green-500' :
                cell.isEnd ? 'bg-red-500' :
                cell.isWall ? 'bg-gray-900' :
                'bg-purple-200'
              } rounded-sm`}
            />
          ))
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        User Dashboard
      </h1>

      {userData && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
          <h2 className="text-xl font-semibold text-purple-400 mb-4">User Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400">Username</p>
              <p className="text-white font-semibold">{userData.username}</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400">Email</p>
              <p className="text-white font-semibold">{userData.email}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
        <h2 className="text-xl font-semibold text-purple-400 mb-4">Saved Grids</h2>
        {grids.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grids.map((grid, index) => (
              <div
                key={grid._id}
                className={`bg-gray-700/50 p-4 rounded-lg cursor-pointer transition-transform hover:scale-105 ${
                  selectedGrid?._id === grid._id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => handleGridSelect(grid)}
              >
                <div className="mb-2">
                  <h3 className="text-white font-semibold">Grid {index + 1}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-purple-400 text-sm">
                      Size: {grid.gridData.length} x {grid.gridData.length}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(grid.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {renderGridPreview(grid.gridData)}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No grids saved yet.</p>
        )}
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
        <h2 className="text-xl font-semibold text-purple-400 mb-4">Chat History</h2>
        {chatMessages.length > 0 ? (
          <div className="space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message._id}
                className={`p-4 rounded-lg ${
                  message.sender === 'user' ? 'bg-purple-900/30 ml-auto' : 'bg-gray-700/50'
                } max-w-2xl`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-purple-400 font-semibold">
                    {message.sender === 'user' ? 'You' : 'Assistant'}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {new Date(message.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-white">{message.message.replace(/<[^>]*>/g, '')}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No chat messages yet.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
