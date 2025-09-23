import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('USER');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Ajout de la validation côté front
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || name.length < 2) {
      setError('Le nom doit contenir au moins 2 caractères.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError("L'email est obligatoire et doit être valide.");
      return;
    }
    if (!password || password.length < 2) {
      setError('Le mot de passe doit contenir au moins 2 caractères.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('name', name);
      formData.append('role', role);
      if (image) formData.append('image', image);
      await apiRequest('/api/user', {
        method: 'POST',
        body: formData,
        // Pas de Content-Type ici, le navigateur le gère
      });
      // Connexion automatique après inscription
      const result = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', result.accessToken || result.token);
      if (result.userId) localStorage.setItem('userId', result.userId.toString());
      navigate('/dashboard');
    } catch (err) {
      let msg = '';
      if (err.errors && Array.isArray(err.errors)) {
        msg = err.errors.map(e => e.message).join(' | ');
      } else if (err.error) {
        msg = err.error;
      } else {
        msg = err.message || "Erreur d'inscription";
      }
      if (msg.includes('Unique constraint failed') || msg.includes('email') || msg.includes('user_email_key')) {
        msg = "Cet email est déjà utilisé. Veuillez vous connecter ou choisir un autre email.";
      }
      setError(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Inscription</h2>
  <form className="flex flex-col gap-4 w-80" onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 rounded"
          minLength={2}
          autoComplete="name"
        />
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
          minLength={2}
          autoComplete="current-password"
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="USER">Utilisateur</option>
          <option value="ADMIN">Administrateur</option>
        </select>
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="bg-green-600 text-white p-2 rounded">S'inscrire</button>
      </form>
      <button className="mt-4 underline" onClick={() => navigate('/login')}>Déjà un compte ? Se connecter</button>
    </div>
  );
};

export default Register;
