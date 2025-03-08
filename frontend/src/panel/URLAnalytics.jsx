// components/URLAnalytics.js
import React, { useState, useEffect } from "react";
import Navbar from "./NavBar";

const URLAnalytics = () => {
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Example: You can replace the static URL with dynamic data
    if (shortenedUrl) {
      fetchAnalytics();
    }
  }, [shortenedUrl]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Placeholder for actual URL analytics API
      const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${shortenedUrl}`);
      const data = await response.json();
      if (data.ok) {
        setStats(data.result);  // Adjust based on actual API response
      } else {
        alert("Failed to fetch analytics.");
      }
    } catch (error) {
      alert("Error fetching analytics.");
    }
    setLoading(false);
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-grow bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold mb-6">URL Analytics</h2>

          {/* URL Analytics Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-medium mb-4">Enter Shortened URL</h3>
            <div className="flex flex-col sm:flex-row items-center space-x-4">
              <input
                type="url"
                value={shortenedUrl}
                onChange={(e) => setShortenedUrl(e.target.value)}
                placeholder="Enter shortened URL here"
                className="w-full sm:w-3/4 p-3 border border-gray-300 rounded-md"
              />
              <button
                onClick={fetchAnalytics}
                disabled={loading || !shortenedUrl}
                className="sm:w-1/4 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? "Fetching..." : "Get Analytics"}
              </button>
            </div>

            {/* Display Analytics Stats */}
            {stats && !loading && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h4 className="text-xl font-semibold">Analytics for: {shortenedUrl}</h4>
                <div className="mt-2">
                  <p><strong>Clicks:</strong> {stats.clicks}</p>
                  <p><strong>Last Click:</strong> {stats.lastClick}</p>
                  <p><strong>Geography:</strong> {stats.geography}</p>
                  {/* You can add more stats based on your API */}
                </div>
              </div>
            )}

            {/* No data available */}
            {stats === null && !loading && (
              <div className="mt-6 p-4 text-gray-500">
                <p>No analytics data available for the given URL.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLAnalytics;
