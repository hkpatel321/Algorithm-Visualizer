import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {BaseUrl} from '../../utils/BaseUrl.js';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BaseUrl}/login`, formData, { withCredentials: true });
      if (response.data.success) {
        const userData = {
          id: response.data.user.id,
          name: response.data.user.username
        };
        login(userData);
        navigate('/visualize');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="auth-form w-full max-w-md p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 rounded focus:outline-none focus:ring-2"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 rounded focus:outline-none focus:ring-2"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
