import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiRequest('/api/user/me')
      .then(setUser)
      .catch(() => {
        setError('Session expirée, veuillez vous reconnecter.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 1500);
      });
    apiRequest('/api/todo')
      .then(setTodos)
      .catch(() => {});
    apiRequest('/api/user')
      .then(setUsers)
      .catch(() => {});
  }, [navigate]);

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!user) return <div className="p-8">Chargement...</div>;

  // Statistiques dynamiques
  const totalTodos = todos.length;
  const totalUsers = users.length;
  
  const sharedTodos = todos.filter(t => Array.isArray(t.sharedWith) && t.sharedWith.length > 0).length;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-700">{totalTodos}</span>
          <span className="mt-2 text-blue-600 font-semibold">Todos totaux</span>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-green-700">{totalUsers}</span>
          <span className="mt-2 text-green-600 font-semibold">Utilisateurs</span>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-yellow-700">{sharedTodos}</span>
          <span className="mt-2 text-yellow-600 font-semibold">Todos partagés</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
