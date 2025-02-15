import './App.css';
import { Routes, Route } from 'react-router-dom';
import LoginRegister from '@/components/LoginRegister';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<LoginRegister />} />
      </Routes>
    </>
  );
}

export default App;
