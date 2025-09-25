

import { Routes, Route, Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Todos from './pages/Todos';
import Header from './components/Header';
import './App.css';

function App() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const hideHeader = ["/", "/login", "/register"].includes(location.pathname);

  useEffect(() => {
    if (!hideHeader) {
      fetch('/api/user/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(data => setCurrentUser(data))
        .catch(() => setCurrentUser(null));
    }
  }, [hideHeader]);

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeader && <Header />}
      {!hideHeader && (
        <nav className="flex items-center justify-between px-4 py-2 bg-green-600 shadow-sm w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-4 items-center">
              <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-green-600 text-white font-bold shadow hover:bg-green-700 transition-all">Tableau de bord</Link>
              <Link to="/todos" className="px-4 py-2 rounded-lg bg-green-600 text-white font-bold shadow hover:bg-green-700 transition-all">Taches</Link> 
            </div>
           
          </div>
        </nav>
      )}
      <div className="max-w-full mx-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
