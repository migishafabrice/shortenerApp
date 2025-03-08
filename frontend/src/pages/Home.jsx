import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for URL shortening
    setTimeout(() => {
      const randomString = Math.random().toString(36).substring(2, 7);
      setShortenedUrl(`bit.ly/${randomString}`);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-darkblue p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-2xl">ShortenerApp</div>
         <div className="hidden md:flex space-x-6">
            <button className="text-white hover:text-blue-200">Why ShortenerApp</button>
            <button className="text-white hover:text-blue-200">Features</button>
            <button className="text-white hover:text-blue-200">Pricing</button>
            <button className="text-white hover:text-blue-200">Enterprise</button>
          </div>
          <div className="flex space-x-4">
            <button className="text-white hover:text-blue-200"><Link to='/login'>Login</Link></button>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium"><Link to='/register'>Register</Link></button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-darkblue py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Shorten your URLs, simplify your workflow</h1>
            {/*<p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">Create branded URLs, QR Codes, and Link-in-bio pages. Share them anywhere.</p>*/}
            
            <div className="max-w-3xl mx-auto bg-white p-4 rounded-lg shadow-lg">
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                <input
                  type="url"
                  placeholder="Paste a long URL"
                  className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Shortening...' : 'Shorten'}
                </button>
              </form>
              
              {shortenedUrl && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md flex justify-between items-center">
                  <span className="text-blue-600 font-medium">{shortenedUrl}</span>
                  <button 
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => {
                      navigator.clipboard.writeText(shortenedUrl);
                      alert('Copied to clipboard!');
                    }}
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">More than just shorter URLs</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Link Analytics</h3>
              <p className="text-gray-600">Track link performance with comprehensive click analytics</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Branded URLs</h3>
              <p className="text-gray-600">Customize your short URLs with your brand name</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">QR Codes</h3>
              <p className="text-gray-600">Generate QR codes for your URLs instantly</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-yelloworange py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text- mb-8">Join thousands of businesses using ShortenerApp to shorten of URLs.</p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-blue-700 transition-colors">Register</button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 mt-auto">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ShortenerApp</h3>
            <p className="text-gray-400">ShortenerApp helps you create short URLs with short names</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Link Management</li>
              <li>QR Codes</li>
              <li>Link-in-bio</li>
              <li>Pricing</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Blog</li>
              <li>Resource Library</li>
              <li>Developers</li>
              <li>Support</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
              <li>Acceptable Use</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-700 text-gray-400 text-sm">
          © 2025 ShortenerApp | All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default Home;