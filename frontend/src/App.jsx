import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './lib/AuthContext';
import { APIProvider } from '@vis.gl/react-google-maps';
import Home from '@/components/Home';
import About from '@/components/About';
import Spinner from '@/components/Spinner';
import Course from '@/components/Course';
import LoginRegister from '@/components/LoginRegister';
import Profile from '@/components/Profile';
import NavBar from '@/components/NavBar';
import axios from 'axios';

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    if (location.pathname === '/login') {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  }, [location]);

  useEffect(() => {
    const token = window.localStorage.getItem('token');

    const tryToLogin = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/account`,
          {
            headers: {
              authorization: token,
            },
          }
        );
        setUser(response.data.user);
      } catch (err) {
        console.error('Authentication failed:', err.message);
        window.localStorage.removeItem('token');
        console.log('User logged out');
        setUser(null);
        if (
          location.pathname !== '/login' &&
          location.pathname !== '/' &&
          location.pathname !== '/about'
        ) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    tryToLogin();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <APIProvider apiKey={apiKey}>
        {showNavbar && <NavBar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/course/:id" element={<Course />} />
        </Routes>
      </APIProvider>
    </AuthContext.Provider>
  );
}

export default App;
