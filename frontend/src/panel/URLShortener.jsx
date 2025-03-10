// components/URLShortener.js
import React, { useState } from "react";
import Navbar from "./NavBar";
import axios from "axios";
const URLShortener = (user) => {
  const [longUrl, setLongUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid,setValid] = useState(false);
  const [name, setName] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  
  const storedUser= JSON.parse(localStorage.getItem('user'));
  if (!storedUser) {
    window.location.href = "/login"; // Redirect to login page
    return null;
  }
const handleValidation = async (e) => {
    e.preventDefault();

    try {
      setNotification({ message: "Checking if "+longUrl+" is valid URL", type: "success" });
      const response = await axios.get(`http://localhost:5000/short-url/valid?url=${longUrl}`);
      if (response.data.status) {
        setValid(true);
        setNotification({ message: "Valid URL, shortening in progress...", type: "success" });
        
        handleShortenUrl(longUrl,storedUser.userid)();
      }
  } 
  catch (error) {
      setNotification({ message: error.response?.data?.message || error.message, type: "error" });
      setValid(false);
    }
  };
  const handleShortenUrl = (url, userid) => async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/short-url/shorten', {url,userid,name},
       { headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': localStorage.getItem('csrfToken'),
      },
      withCredentials: true,
       }
    );
      const data = response.data; // Axios parses JSON automatically
      if (data.ok) {
        setShortenedUrl(data.result.short_code);
        setNotification({ message: "", type: "" });
      } 
    } catch (error) {
      setNotification({ message: error.response?.data?.error || error.message, type: "error" });
    }
    setLoading(false);
  };
  const handleRedirect = (shortUrl)=>async() => {
      try {
        const response = await axios.get(`http://localhost:5000/short-url/redirect/${encodeURIComponent(shortUrl)}`);
        if (response.data) {
          window.open(response.data.long_url, '_blank');
        }
      }
      catch (error) {
        setNotification({ type: "error", message: "Error redirecting URL: " + (error.response?.data?.error || error.message) });
      }
    };
  return (
    <div className="flex">
      <Navbar />
      <div className="flex-grow bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold mb-6">Shorten Your URL</h2>
          {notification?.message && <div className={`p-0 mb-4 text- ${notification.type==="success"?"text-green-500":"text-red-500"} `}>{notification.message}</div>}
          {/* URL Shortening Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-medium mb-4">Enter Your URL</h3>
            <form onSubmit={handleValidation}>
            <div className="flex flex-col sm:flex-row items-center space-x-4">
            <textarea
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter description for your long URL here"
                className="w-full sm:w-3/4 p-3 border border-gray-300 rounded-md"
                required
              />
              <input
                type="url"
                name="longUrl"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="Enter your long URL here"
                className="w-full sm:w-3/4 p-3 border border-gray-300 rounded-md"
                required
              />
              <button
              type="submit"
                
                disabled={loading || !longUrl}
                className="sm:w-1/4 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? "Shortening..." : "Shorten URL"}
              </button>
            </div></form>

            {/* Display Shortened URL */}
            {shortenedUrl && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h4 className="text-xl font-semibold">Your Shortened URL:</h4>
                <div className="mt-2 text-blue-500">
                <a   onClick={() => handleRedirect(shortenedUrl)()}
                  style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
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
