import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useState,useEffect } from 'react';
const Login = () => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [notification, setNotification] = useState("");
const [csrfToken, setCsrfToken] = useState('');
const navigate=useNavigate();
 // Fetch CSRF token
 useEffect(() => {
  axios.get('http://localhost:5000/csrf-token', { withCredentials: true })
    .then((response) => {
      setCsrfToken(response.data.csrfToken);
    })
    .catch((error) => {
      setNotification({ type: 'error', message: `CSRF Token Error: ${error.response?.data?.error || error.message}` });
    });
}, []);

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      'http://localhost:5000/auth/login',
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken, // CSRF token for security
        },
        withCredentials: true,
      }
    );

    if (response.data) {
      const accessToken = response.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('csrfToken', csrfToken);
      navigate('/dashboard');
    } else {
      setNotification({ type: 'error', message: `Login failed: ${response.data?.error || 'Unknown error'}` });
    }
  } catch (error) {
    console.error('Login Error:', error); // Log the error for debugging
    setNotification({ type: 'error', message: `Error: ${error.response?.data?.error || error.message}` });
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-darkblue">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login to ShortenerApp</h2>
        {notification && (
          <div className={`text-white p-3 rounded-md ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
            {notification.message}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" name='email' className="w-full p-3 border rounded-xl" placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input type="password" name='password' className="w-full p-3 border rounded-xl" placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-yelloworange text-white p-3 rounded-xl">Login</button>
        </form>
        <p className="text-center mt-4">
        <Link to="/" className="text-green-600"><i class="fas fa-home text-2xl text-green-600"></i> Home</Link></p>
      </div>
    </div>
  );
};
export default Login;