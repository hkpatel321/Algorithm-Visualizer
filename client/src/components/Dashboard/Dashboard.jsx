import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseUrl';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [grids, setGrids] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedGrid, setSelectedGrid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const gridsRef = useRef([]);
  const chatMessagesRef = useRef([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BaseUrl}/api/chat/dashboard`, { withCredentials: true });
        if (response.data.success) {
          console.log('Fetched user data:', response.data.user);
          console.log('Fetched grids:', response.data.grids);
          console.log('Fetched chat messages:', response.data.chatMessages);

          setUserData(response.data.user);
          setGrids(response.data.grids || []);
          setChatMessages(response.data.chatMessages || []);

          gridsRef.current = response.data.grids || [];
          chatMessagesRef.current = response.data.chatMessages || [];
        } else {
          console.error('Failed to fetch dashboard data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (gridsRef.current.length === 0 && chatMessagesRef.current.length === 0) {
      console.log('Fetching data as refs are empty');
      fetchDashboardData();
    } else {
      console.log('Using persisted data from refs');
      console.log('Persisted grids:', gridsRef.current);
      console.log('Persisted chat messages:', chatMessagesRef.current);

      setGrids(gridsRef.current);
      setChatMessages(chatMessagesRef.current);
    }
  }, [isAuthenticated, navigate]); 
  const handleGridSelect = (grid) => {
    setSelectedGrid(grid);
  };

  const renderGridPreview = (grid) => {
    if (!grid || !grid.data || !Array.isArray(grid.data)) {
      console.log('Invalid grid data:', grid);
      return (
        <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
          Invalid grid data
        </div>
      );
    }

    return (
      <div className={`grid grid-cols-10 gap-0.5 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-800'} p-2 rounded-lg`}>
        {grid.data.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {Array.isArray(row) ? row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-4 h-4 ${
                  cell?.isStart ? 'bg-green-500' :
                  cell?.isEnd ? 'bg-red-500' :
                  cell?.isWall ? (theme === 'light' ? 'bg-gray-400' : 'bg-gray-900') :
                  theme === 'light' ? 'bg-purple-300' : 'bg-purple-200'
                } rounded-sm`}
              />
            )) : null}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme === 'light' ? 'border-purple-600' : 'border-purple-400'}`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center ${theme === 'light' ? 'text-red-600' : 'text-red-400'} p-4`}>
        {error}
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-4 space-y-6 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
      <h1 className={`text-3xl font-bold mb-8 text-center ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
        User Dashboard
      </h1>

      {userData && (
        <div className={`rounded-lg p-6 border ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800/50 border-purple-500/30'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-purple-400'}`}>User Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700/50'}`}>
              <p className="text-gray-400">Username</p>
              <p className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{userData.username}</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700/50'}`}>
              <p className="text-gray-400">Email</p>
              <p className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{userData.email}</p>
            </div>
          </div>
        </div>
      )}

      <div className={`rounded-lg p-6 border ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800/50 border-purple-500/30'}`}>
        <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-purple-400'}`}>Saved Grids</h2>
        {grids.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grids.map((grid, index) => (
              <div
                key={grid._id}
                className={`p-4 rounded-lg cursor-pointer transition-transform hover:scale-105 ${
                  selectedGrid?._id === grid._id
                    ? theme === 'light'
                      ? 'ring-2 ring-purple-500'
                      : 'ring-2 ring-purple-500'
                    : theme === 'light'
                    ? 'bg-gray-100'
                    : 'bg-gray-700/50'
                }`}
                onClick={() => handleGridSelect(grid)}
              >
                <div className="mb-2">
                  <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Grid {index + 1}</h3>
                  <div className="flex justify-between items-center">
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-purple-400'}`}>
                      Size: {grid.gridData.length} x {grid.gridData.length}
                    </p>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(grid.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {renderGridPreview(grid.gridData)}
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>No grids saved yet.</p>
        )}
      </div>

      <div className={`rounded-lg p-6 border ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800/50 border-purple-500/30'}`}>
        <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-purple-400'}`}>Chat History</h2>
        {chatMessages.length > 0 ? (
          <div className="space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message._id}
                className={`p-4 rounded-lg ${
                  message.sender === 'user'
                    ? theme === 'light'
                      ? 'bg-purple-100 ml-auto'
                      : 'bg-purple-900/30 ml-auto'
                    : theme === 'light'
                    ? 'bg-gray-100'
                    : 'bg-gray-700/50'
                } max-w-2xl`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-purple-400'}`}>
                    {message.sender === 'user' ? 'You' : 'Assistant'}
                  </span>
                  <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(message.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{message.message.replace(/<[^>]*>/g, '')}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>No chat messages yet.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
