import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };
  const hideHeader = ["/login", "/register"].includes(location.pathname);
  if (hideHeader) return null;
  return (
    <header className="flex items-center justify-between px-3 py-2 shadow-sm mb-2 border-b border-green-100 w-full min-h-[56px] bg-white">
      <span className="font-bold text-base sm:text-lg text-green-700">MYTODO</span>
      <button onClick={handleLogout} className="flex items-center gap-1 sm:gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-xl shadow transition-all text-sm sm:text-base">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 sm:w-5 sm:h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
        </svg>
        Déconnexion
      </button>
    </header>
  );
};

export default Header;
