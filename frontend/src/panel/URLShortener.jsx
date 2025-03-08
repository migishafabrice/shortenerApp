// components/URLShortener.js
import React, { useState } from "react";
import Navbar from "./NavBar";

const URLShortener = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShortenUrl = async () => {
    setLoading(true);
    try {
      // Placeholder for actual URL shortening API
      const response = await fetch("https://api.shrtco.de/v2/shorten?url=" + longUrl);
      const data = await response.json();
      if (data.ok) {
        setShortenedUrl(data.result.full_short_link);
      } else {
        alert("Failed to shorten URL.");
      }
    } catch (error) {
      alert("Error shortening URL.");
    }
    setLoading(false);
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-grow bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold mb-6">Shorten Your URL</h2>
          
          {/* URL Shortening Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-medium mb-4">Enter Your URL</h3>
            <div className="flex flex-col sm:flex-row items-center space-x-4">
              <input
                type="url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="Enter your long URL here"
                className="w-full sm:w-3/4 p-3 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleShortenUrl}
                disabled={loading || !longUrl}
                className="sm:w-1/4 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? "Shortening..." : "Shorten URL"}
              </button>
            </div>

            {/* Display Shortened URL */}
            {shortenedUrl && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h4 className="text-xl font-semibold">Your Shortened URL:</h4>
                <div className="mt-2 text-blue-500">
                  <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">
                    {shortenedUrl}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLShortener;
