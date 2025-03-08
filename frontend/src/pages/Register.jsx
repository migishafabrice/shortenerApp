import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
const Register = () => {
    return (
      <div className="flex justify-center items-center min-h-screen bg-darkblue">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Register On ShortenerApp</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Username</label>
              <input type="text" className="w-full p-3 border rounded-xl" placeholder="Enter your username" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input type="email" className="w-full p-3 border rounded-xl" placeholder="Enter your email" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input type="password" className="w-full p-3 border rounded-xl" placeholder="Enter your password" />
            </div>
            <button type="submit" className="w-full bg-yelloworange text-white p-3 rounded-xl">Register</button>
          </form>
          <p className="text-center mt-4">
          <Link to="/" className="text-green-600"><i class="fas fa-home text-2xl text-green-600"></i> Home</Link></p>
        </div>
      </div>
    );
  };
  export default Register;