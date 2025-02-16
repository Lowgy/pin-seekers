import './App.css';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './lib/AuthContext';
import LoginRegister from '@/components/LoginRegister';
import Home from '@/components/Home';
import { APIProvider } from '@vis.gl/react-google-maps';

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <APIProvider apiKey={apiKey}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginRegister />} />
        </Routes>
      </APIProvider>
    </AuthContext.Provider>
  );
}

export default App;
