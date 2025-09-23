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
    <div className="min-h-screen bg-white flex flex-col items-center py-6">
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-6 text-center">Tableau de bord</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-green-100 rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-green-700">{totalTodos}</span>
            <span className="mt-1 text-green-600 font-semibold text-sm sm:text-base">Todos totaux</span>
          </div>
          <div className="bg-white border border-green-100 rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-green-700">{totalUsers}</span>
            <span className="mt-1 text-green-600 font-semibold text-sm sm:text-base">Utilisateurs</span>
          </div>
          <div className="bg-white border border-green-100 rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-green-700">{sharedTodos}</span>
            <span className="mt-1 text-green-600 font-semibold text-sm sm:text-base">Todos partagés</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-green-50 rounded-xl shadow p-4">
            <h3 className="text-xl font-bold text-green-700 mb-2">Bienvenue, {user.name} !</h3>
            <p className="text-green-900 text-sm">Gérez vos tâches, consultez les utilisateurs et partagez vos todos.</p>
          </div>
          <div className="flex gap-2 justify-center mt-2">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl shadow transition-all text-sm" onClick={() => navigate('/todos')}>Voir mes todos</button>
            <button className="bg-white border border-green-600 text-green-700 font-bold py-2 px-4 rounded-xl shadow hover:bg-green-50 transition-all text-sm" onClick={() => navigate('/historique')}>Historique</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
