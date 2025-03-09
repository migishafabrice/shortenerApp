// components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaLink, FaHome,FaChartBar, FaCog, FaUserCircle, FaSignOutAlt } from "react-icons/fa"; // Icons for navbar links
const Navbar = ({ user, onLogout }) => {
  const [storedUser, setStoredUser] = useState(null);
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setStoredUser(user); // Update local state
    } else {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser) {
        setStoredUser(savedUser); // Retrieve saved user
      }
    }
  }, [user]);
  const fullName = user
  ? `${user.userFirstname || "Guest"} ${user.userLastname || ""}`
  : storedUser
  ? `${storedUser.userFirstname || "Guest"} ${storedUser.userLastname || ""}`
  : "Guest";
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('csrfToken');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Redirect to login page
  };
  return (
    <div className="w-64 bg-gray-800 text-white h-screen flex flex-col">
      <div className="p-6 text-2xl font-bold">sh.ly</div>
      <nav className="flex-grow">
        <ul className="space-y-4 p-4">
        <li>
  <Link to="/dashboard" className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md">
    <FaHome />
    <span>DashBoard</span>
  </Link>
</li>

          <li>
            <Link to="/shortener" className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md">
              <FaLink />
              <span>Shorten New URL</span>
            </Link>
          </li>
         {/*} <li>
            <Link to="/manage" className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md">
              <FaCog />
              <span>Manage URLs</span>
            </Link>
          </li>*/}
          <li>
            <Link to="/analytics" className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md">
              <FaChartBar />
              <span>URL Analytics</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Profile Section */}
      <div className="flex flex-col items-center p-4 bg-gray-700 mt-auto">
  {/*<img 
    src="https://pixabay.com/illustrations/icon-profile-user-clip-art-7797704/"
    alt="User Profile" 
    className="w-10 h-10 rounded-full mb-2"
  />*/}
  <p className="text-white text-sm">{fullName}</p>
  <button
    onClick={handleLogout}
    className="text-white hover:bg-gray-600 p-2 rounded-full mt-2"
    title="Logout"
  >
    <FaSignOutAlt />
  </button>
</div>


      {/* Footer */}
      <div className="p-4 text-xs text-center text-gray-400">
        &copy; 2025 Short.ly | All Rights Reserved
      </div>
    </div>
  );
};

export default Navbar;
