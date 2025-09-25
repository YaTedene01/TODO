import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) {
      setError("L'email est obligatoire et doit être valide.");
      return;
    }
    if (!password || password.length < 2) {
      setError('Le mot de passe doit contenir au moins 2 caractères.');
      return;
    }
    try {
      const result = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (typeof result === 'string') {
        localStorage.setItem('token', result);
      } else {
        localStorage.setItem('token', result.accessToken || result.token);
        if (result.userId) localStorage.setItem('userId', result.userId.toString());
      }
      if (!localStorage.getItem('userId')) {
        try {
          const users = await apiRequest(`/api/user?email=${encodeURIComponent(email)}`);
          if (Array.isArray(users) && users.length > 0) {
            localStorage.setItem('userId', users[0].id.toString());
          }
        } catch {}
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-green-100">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Connexion</h2>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border-2 border-green-300 focus:border-green-500 focus:ring-green-200 focus:ring-2 p-3 rounded-xl outline-none transition-all bg-white"
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border-2 border-green-300 focus:border-green-500 focus:ring-green-200 focus:ring-2 p-3 rounded-xl outline-none transition-all bg-white"
            autoComplete="current-password"
          />
          {error && <div className="text-red-500 text-center font-medium">{error}</div>}
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow transition-all">Se connecter</button>
        </form>
        <button className="mt-6 w-full text-green-700 hover:text-green-900 underline font-semibold transition-all" onClick={() => navigate('/register')}>Créer un compte</button>
      </div>
    </div>
  );
};

export default Login;
