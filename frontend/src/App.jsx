import './App.css';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './lib/AuthContext';
import LoginRegister from '@/components/LoginRegister';
import Home from '@/components/Home';

function App() {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRegister />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
