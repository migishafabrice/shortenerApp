
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashBoard from './panel/DashBoard';
import URLShortener from './panel/URLShortener';
import URLAnalytics from './panel/URLAnalytics';

function App() {
  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Landing page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/shortener" element={<URLShortener />} />
        <Route path="/analytics" element={<URLAnalytics />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
