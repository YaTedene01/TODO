import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Ajout de la validation côté front
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
      // On suppose que l'API retourne { accessToken, userId } ou { token, userId }
      const result = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      // Compatibilité : si c'est juste un string, on ne peut pas stocker l'id
      if (typeof result === 'string') {
        localStorage.setItem('token', result);
      } else {
        localStorage.setItem('token', result.accessToken || result.token);
        if (result.userId) localStorage.setItem('userId', result.userId.toString());
      }
      // Si pas d'id, on va le chercher via /api/user?email=...
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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Connexion</h2>
      <form className="flex flex-col gap-4 w-80" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 rounded"
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 rounded"
          autoComplete="current-password"
        />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Se connecter</button>
      </form>
      <button className="mt-4 underline" onClick={() => navigate('/register')}>Créer un compte</button>
    </div>
  );
};

export default Login;
