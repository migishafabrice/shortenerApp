// components/Dashboard.js
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./NavBar";
import axios from "axios";
import { useEffect, useState } from "react";
const Dashboard = () => {
  const urls = [
    { id: 1, originalUrl: "https://example.com", shortenedUrl: "short.ly/abcd" },
    { id: 2, originalUrl: "https://google.com", shortenedUrl: "short.ly/xyz" },
  ];
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Access token missing. Please log in.");
        window.location.href = "/login"; // Redirect to login
        return;
      }
  
      try {
        const response = await axios.get("http://localhost:5000/user", {
          headers: {
            authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        if(response.data){
        setUser(response.data.user);
        }
      } catch (error) {
        alert("Error fetching user: " + error.response?.data?.error || error.message);
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          window.location.href = "/login"; // Redirect to login
        }
      }
    };
    fetchUser();
  }, []);
  

  return (
    <div className="flex">
      <Navbar user={user}/>
      <div className="flex-grow bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold mb-6">Manage Your Shortened URLs</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Original URL</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Shortened URL</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <tr key={url.id} className="border-t">
                    <td className="px-6 py-4 text-sm text-gray-700">{url.originalUrl}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{url.shortenedUrl}</td>
                    <td className="px-6 py-4 text-sm">
                      <Link to={`/reports/${url.id}`} className="text-blue-500 hover:underline">
                        View Stats
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
