// components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { FaLink, FaChartBar, FaCog, FaUserCircle, FaSignOutAlt } from "react-icons/fa"; // Icons for navbar links

const Navbar = ({ user, onLogout }) => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen flex flex-col">
      <div className="p-6 text-2xl font-bold">Short.ly</div>
      <nav className="flex-grow">
        <ul className="space-y-4 p-4">
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
      <div className="flex items-center p-4 bg-gray-700 mt-auto">
      {/* src={user.profilePicture || "https://via.placeholder.com/40"}  */}
        <img 
          src="https://pixabay.com/illustrations/icon-profile-user-clip-art-7797704/"
          alt="User Profile" 
          className="w-10 h-10 rounded-full mr-3"
        />
        <div className="text-white flex-grow">
       {/* <p className="text-sm">{user.name || "Guest"}</p>*/}
          <p className="text-sm">Guest</p>
        </div>
        <button
          onClick={onLogout}
          className="text-white hover:bg-gray-600 p-2 rounded-full"
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
