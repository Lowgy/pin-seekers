import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthContext } from './lib/AuthContext';
import { APIProvider } from '@vis.gl/react-google-maps';
import Home from '@/components/Home';
import Course from '@/components/Course';
import LoginRegister from '@/components/LoginRegister';
import Profile from '@/components/Profile';
import NavBar from '@/components/NavBar';

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    if (location.pathname === '/login') {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  }, [location]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <APIProvider apiKey={apiKey}>
        {showNavbar && <NavBar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/course/:id" element={<Course />} />
        </Routes>
      </APIProvider>
    </AuthContext.Provider>
  );
}

export default App;
