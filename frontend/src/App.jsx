import './App.css';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './lib/AuthContext';
import { APIProvider } from '@vis.gl/react-google-maps';
import Home from '@/components/Home';
import Course from '@/components/Course';
import LoginRegister from '@/components/LoginRegister';

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <APIProvider apiKey={apiKey}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/course/:id" element={<Course />} />
        </Routes>
      </APIProvider>
    </AuthContext.Provider>
  );
}

export default App;
