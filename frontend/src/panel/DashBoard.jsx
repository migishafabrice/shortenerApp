import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./NavBar";
import axios from "axios";

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  
  const csrfToken = localStorage.getItem("csrfToken");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!accessToken || !csrfToken) {
      window.location.href = "/login"; // Redirect to login page
      return null;
    }
  }, [accessToken, csrfToken]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setNotification({ type: "error", message: "Access token missing. Please log in." });
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
        if (response.data) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
      } catch (error) {
        setNotification({ type: "error", message: "Error fetching user: " + error.response?.data?.error || error.message });
        if (error.response?.status === 401) {
          window.location.href = "/login"; // Redirect to login
        }
      }
    };
    fetchUser();
  }, []);

  const fetchUrls = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setNotification({ type: "error", message: "Access token missing. Please log in." });
      window.location.href = "/login"; // Redirect to login
      return;
    }

    const userid = JSON.parse(localStorage.getItem("user"))?.userid;
    try {
      const response = await axios.get("http://localhost:5000/short-url/urls", {
        params: { userid },
        headers: { authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.data) {
        setUrls(response.data.urls || []); // Handle empty or undefined data gracefully
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Error fetching URLs: " + (error.response?.data?.error || error.message),
      });
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleDelete = async (shortUrl) => {
    if (!window.confirm("Are you sure you want to delete this URL?")) {
      return;
    }

    const token = localStorage.getItem("accessToken");
    const csrfToken = localStorage.getItem("csrfToken");
    try {
      const response = await axios.delete(`http://localhost:5000/short-url/delete/${encodeURIComponent(shortUrl)}`, {
        headers: {
          authorization: `Bearer ${token}`,
          "CSRF-Token": csrfToken,
        },
        withCredentials: true,
      });
      if (response.data) {
        setNotification({ type: "success", message: "URL deleted successfully" });
        fetchUrls();
      }
    } catch (error) {
      setNotification({ type: "error", message: "Error deleting URL: " + (error.response?.data?.error || error.message) });
    }
  };

  const handleEdit = (url) => {
    setSelectedUrl(url);
    setIsModalOpen(true); // Open the modal
  };

  const handleRedirect = (shortUrl) => async () => {
    try {
      const response = await axios.get(`http://localhost:5000/short-url/redirect/${encodeURIComponent(shortUrl)}`);
      if (response.data) {
        window.open(response.data.long_url, "_blank");
      }
      fetchUrls();
    } catch (error) {
      setNotification({ type: "error", message: "Error redirecting URL: " + (error.response?.data?.error || error.message) });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUrl(null);
  };

const handleUpdate = (shortUrl)=>async (e) => {
  e.preventDefault();
  try {
    const response = await axios.put(
      `http://localhost:5000/short-url/update/${encodeURIComponent(shortUrl)}`,
      { long_url: selectedUrl.long_url },
      {
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
          authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    if (response.data) {
      setNotification({ type: 'success', message: 'URL updated successfully' });
      fetchUrls();
      handleModalClose();
    }
  } catch (error) {
    setNotification({ type: 'error', message: `Error updating URL: ${error.response?.data?.error || error.message}` });
  }
};
  return (
    <div className="flex">
      <Navbar user={user} />
      <div className="flex-grow bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold mb-6">Manage Your Shortened URLs</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {notification?.message && (
              <div className={`p-0 mb-4 text-${notification.type === "success" ? "green-500" : "red-500"}`}>
                {notification.message}
              </div>
            )}
            {urls && urls.length === 0 ? (
              <div className="text-red-500">No URLs found.</div>
            ) : (
              <table className="min-w-full table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Original URL</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Shortened URL</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Clicks</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map((url) => (
                    <tr key={url.id} className="border-t">
                      <td className="px-6 py-4 text-sm text-gray-700">{url.long_url}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{url.short_code}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{url.clicks}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 flex items-center space-x-4">
                        {/* View Stats */}
                        {/* <Link
                          to={`/reports/${url.id}`}
                          className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2a10 10 0 100 20 10 10 0 100-20zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z" />
                          </svg>
                          <span>Stats</span>
                        </Link> */}

                        {/* Open in New Tab */}
                        <button
                          type="button"
                          onClick={handleRedirect(url.short_code)}
                          className="text-green-500 hover:text-green-700 flex items-center space-x-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M12 2a1 1 0 011 1v4a1 1 0 01-2 0V4H5v10h5a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1h8zm3.293 2.293a1 1 0 010 1.414L12.414 9H15a1 1 0 110 2h-4a1 1 0 01-1-1V6a1 1 0 112 0v2.586l2.293-2.293a1 1 0 011.414 0z" />
                          </svg>
                          <span>Open</span>
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleEdit(url)}
                          className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0l-10 10A2 2 0 004 13v3a1 1 0 001 1h3a2 2 0 001.414-.586l10-10a2 2 0 000-2.828l-1-1zM6 15H5v-1l7.586-7.586 1 1L6 15z" />
                          </svg>
                          <span>Edit</span>
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(url.short_code)}
                          className="text-red-500 hover:text-red-700 flex items-center space-x-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 4V3a1 1 0 011-1h6a1 1 0 011 1v1h5a1 1 0 010 2h-1v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6H2a1 1 0 010-2h4zm2-1v1h4V3H8zm5 3H7v10h6V6z" clipRule="evenodd" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Editing URL */}
      {isModalOpen && selectedUrl && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Edit URL</h3>
            <input
              type="text"
              value={selectedUrl.long_url}
              onChange={(e) => setSelectedUrl({ ...selectedUrl, long_url: e.target.value })}
              className="p-2 border border-gray-300 rounded mb-4 w-full"
            />
            <div className="flex justify-end">
              <button onClick={handleUpdate(selectedUrl.short_code)} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                Save
              </button>
              <button onClick={handleModalClose} className="bg-gray-300 text-black px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
