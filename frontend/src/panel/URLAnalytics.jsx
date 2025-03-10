// components/URLAnalytics.js
import React, { useState, useEffect } from "react";
import Navbar from "./NavBar";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import axios from "axios";
const URLAnalytics = () => {
  
  const [loading, setLoading] = useState(false);
  const [urlsCount, setUrlsCount] = useState(""); // Track number of URLs registered
  const [clicksOverTime, setClicksOverTime] = useState(""); // Track number of clicks over time
  const [visits, setVisits] = useState(""); // Track number of visits
  const [notification, setNotification] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem('user'));

  // Redirect if no user is logged in
  useEffect(() => {
    if (!storedUser) {
      window.location.href = "/login"; // Redirect to login page
      return null;
    }
  }, [storedUser]);

  useEffect(() => {
    fetchAnalyticsData(); // Fetch the analytics on component mount
  }, []);

  // Fetch analytics data (Example API URL)
  const fetchAnalyticsData = async () => {
    
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const csrfToken = localStorage.getItem('csrfToken');
      // Placeholder for your actual analytics data API
      const response = await axios.get('http://localhost:5000/short-url/analytics',
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${accessToken}`,
            "CSRF-Token": csrfToken,
          },
          withCredentials: true,

        }
      );
      
      if (response.data) {
        //setStats(data.result);
        setUrlsCount(response.data.totalUrls); 
        setClicksOverTime(response.data.totalClicks);
        setVisits(response.data.totalVisits);
        
     } 
    } catch (error) {
      setNotification({ type: 'error', message: `Error fetching analytics data: ${error.message}` });
    }
    setLoading(false);
  };
return (
    <div className="flex">
      <Navbar />
      <div className="flex-grow bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold mb-6">URL Analytics Dashboard</h2>
{/* Notification */}
          {notification && (  
            <div className={`text-white p-3 rounded-md ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
              {notification.message} 
            </div>
          )}           
          {/* Analytics Summary */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-medium mb-4">Summary</h3>
            <div className="flex justify-between space-x-8">
              <div className="bg-gray-50 p-4 rounded-md w-1/3">
                <h4 className="text-xl font-semibold">Total Clicks</h4>
                <p className="text-3xl">{clicksOverTime?clicksOverTime:"0"}</p>
                
              </div>
              <div className="bg-gray-50 p-4 rounded-md w-1/3">
                <h4 className="text-xl font-semibold">Total URLs Registered</h4>
                <p className="text-3xl">{urlsCount?urlsCount:"0"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md w-1/3">
                <h4 className="text-xl font-semibold">Total Visits</h4>
                <p className="text-3xl">{visits?visits:"0"}</p>
              </div>
            </div>
          </div>         
        </div>
      </div>
    </div>
  );
};

export default URLAnalytics;
