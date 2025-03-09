import React, { useState,useEffect, use } from 'react';
import axios from 'axios';
import { Link} from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    rePassword: '',
  });
  const [notification, setNotification] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  useEffect(() => {
    axios.get('http://localhost:5000/csrf-token', { withCredentials: true })
      .then((response) => {
        setCsrfToken(response.data.csrfToken);  // Set token from backend response
      })
      .catch((error) => {
        console.error('Error fetching CSRF token:', error);
      });
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.rePassword) {
      setNotification({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    try {
      
      const response = await axios.post('http://localhost:5000/auth/register', formData, {
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken, // CSRF token for security
        },
        withCredentials: true, // Send cookies (for CSRF protection)
      });

      if (response.data) {
        setNotification({
          type: 'success',
          message: (
            <>
              Registration successful! Please  
              <Link to="/login" className="font-bold text-blue-600 underline hover:text-blue-800">login</Link>.
            </>
          )
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.response ? error.response.data.error : error.message,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-darkblue">
      {/* Helmet to inject CSRF token into the <head> */}
      <Helmet>
      <meta name="csrf-token" content="{ csrfToken }" />
      </Helmet>

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register On ShortenerApp</h2>
        {notification && (
  <div className={`mb-4 relative flex w-full p-3 text-sm rounded-md ${notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
    {notification.message}
  </div>
)}
 <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium">First name</label>
            <input type="text" name="firstName" className="w-full p-3 border rounded-xl" placeholder="Enter your first name" onChange={handleChange} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Last name</label>
            <input type="text" name="lastName" className="w-full p-3 border rounded-xl" placeholder="Enter your last name" onChange={handleChange} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" name="email" className="w-full p-3 border rounded-xl" placeholder="Enter your email" onChange={handleChange} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input type="password" name="password" className="w-full p-3 border rounded-xl" placeholder="Enter your password" onChange={handleChange} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Re-type Password</label>
            <input type="password" name="rePassword" className="w-full p-3 border rounded-xl" placeholder="Re-type your password" onChange={handleChange} required />
          </div>
          <button type="submit" className="w-full bg-yelloworange text-white p-3 rounded-xl">Register</button>
        </form>
        <p className="text-center mt-4">
          <Link to="/" className="text-green-600">
            <i className="fas fa-home text-2xl text-green-600"></i> Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
