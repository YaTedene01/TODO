import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { ClipboardList, CheckCircle2, Pencil, Trash2, Share2, History } from 'lucide-react';

const Todos = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [users, setUsers] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem('userId'));
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [shareId, setShareId] = useState('');
  const [shareTodoId, setShareTodoId] = useState(null);
  const [shareMsg, setShareMsg] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodo, setEditTodo] = useState({ title: '', description: '' });
  const [fetchId, setFetchId] = useState('');
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 3;

  const fetchTodos = async () => {
    try {
      const data = await apiRequest('/api/todo');
      setTodos(data);
    } catch (err) {
      setError('Erreur lors du chargement des todos');
    }
  };

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    apiRequest('/api/user/me')
      .then(setCurrentUser)
      .catch(() => {});
    // Redirige si pas connecté
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchTodos();
    // Historique
    apiRequest('/api/historique')
      .then(setHistorique)
      .catch(() => setError('Erreur lors du chargement de l\'historique'));
    // Récupérer tous les utilisateurs pour afficher leur nom dans l'historique
    apiRequest('/api/user')
      .then(setUsers)
      .catch(() => {});
  }, [navigate]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;
    try {
      await apiRequest('/api/todo', {
        method: 'POST',
        body: JSON.stringify({ title: newTodo.title, completed: false, description: newTodo.description }),
      });
      setNewTodo({ title: '', description: '' });
      fetchTodos();
    } catch (err) {
      setError(err?.errors?.[0]?.message || err?.error || 'Erreur lors de l\'ajout');
    }
  };

  const handleEdit = (todo) => {
    setEditTodoId(todo.id);
    setEditTodo({ title: todo.title, description: todo.description || '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest(`/api/todo/${editTodoId}`, {
        method: 'PUT',
        body: JSON.stringify({ title: editTodo.title, completed: false, userId, description: editTodo.description }),
      });
      setEditTodoId(null);
      setEditTodo({ title: '', description: '' });
      fetchTodos();
    } catch (err) {
      setError(err?.error || 'Erreur lors de la modification');
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/api/todo/${id}`, { method: 'DELETE' });
      fetchTodos();
    } catch (err) {
      setError(err?.error || 'Erreur lors de la suppression');
    }
  };

  const handleShare = async (todoId, userIdToShare) => {
    if (!userIdToShare) return;
    try {
      await apiRequest(`/api/todo/${todoId}/share`, {
        method: 'POST',
        body: JSON.stringify({ userId: userIdToShare, canEdit: true, canDelete: false }),
      });
      setShareMsg('Todo partagé !');
      setTimeout(() => setShareMsg(''), 2000);
      setShareId('');
      setShareTodoId(null);
    } catch (err) {
      setShareMsg(err?.error || 'Erreur lors du partage');
    }
  };

  const handleComplete = async (id) => {
    try {
      await apiRequest(`/api/todo/${id}/complete`, { method: 'PATCH' });
      fetchTodos();
    } catch (err) {
      setError(err?.error || 'Erreur lors du marquage comme complet');
    }
  };

  return (
  <div className="w-1/2 m-0 p-0 " style={{ overflow: 'hidden', width: 'calc(100vw - 1rem)'}}>
      {currentUser && (
        <div className="flex justify-end mb-6">
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-5 py-2 rounded-full font-medium shadow border border-blue-200">
            <img src={currentUser.imageUrl || '/vite.svg'} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-blue-300" />
            Connecté : {currentUser.name || currentUser.nom || currentUser.email}
          </span>
        </div>
      )}
  <div className="flex gap-2 justify-center items-center sm:gap-4 mb-10">
        <button
          className={`flex items-center gap-2 px-5 sm:px-8 py-3 rounded-xl font-semibold border-b-4 transition-all duration-150 text-lg shadow ${activeTab === 'all' ? 'border-blue-600 text-blue-700 bg-white shadow-lg' : 'border-transparent text-gray-500 hover:bg-white hover:shadow-md'}`}
          onClick={() => setActiveTab('all')}
        >
          <ClipboardList className="w-6 h-6" /> Tous les Todos
        </button>
        <button
          className={`flex items-center gap-2 px-5 sm:px-8 py-3 rounded-xl font-semibold border-b-4 transition-all duration-150 text-lg shadow ${activeTab === 'user' ? 'border-blue-600 text-blue-700 bg-white shadow-lg' : 'border-transparent text-gray-500 hover:bg-white hover:shadow-md'}`}
          onClick={() => setActiveTab('user')}
        >
          <ClipboardList className="w-6 h-6" /> Mes Todos
        </button>
        <button
          className={`flex items-center gap-2 px-5 sm:px-8 py-3 rounded-xl font-semibold border-b-4 transition-all duration-150 text-lg shadow ${activeTab === 'historique' ? 'border-blue-600 text-blue-700 bg-white shadow-lg' : 'border-transparent text-gray-500 hover:bg-white hover:shadow-md'}`}
          onClick={() => setActiveTab('historique')}
        >
          <History className="w-6 h-6" /> Historique
        </button>
      </div>

      {(activeTab === 'all' || activeTab === 'user') && (
        <>
          <div className="mb-10 w-1/2 justify-center items-center mx-auto">
            <form className="w-full bg-white justify-center items-center p-8 rounded-2xl shadow-2xl border border-green-100" onSubmit={handleAdd}>
              <h2 className="text-3xl font-bold text-green-700 mb-6">Ajouter une nouvelle tâche</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Titre du todo"
                  value={newTodo.title}
                  onChange={e => setNewTodo({ ...newTodo, title: e.target.value })}
                  className="flex-1 border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
                  required
                />
                <textarea
                  placeholder="Description (optionnelle)"
                  value={newTodo.description}
                  onChange={e => setNewTodo({ ...newTodo, description: e.target.value })}
                  className="flex-1 border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
                />
              </div>
              <button
                type="submit"
                className="mt-6 w-full bg-green-500 text-white p-4 rounded-xl shadow-lg hover:bg-green-600"
              >
                Ajouter
              </button>
            </form>
          </div>

          {error && <div className="text-red-500 text-center mb-6 font-semibold text-lg">{error}</div>}

          {/* Pagination logic and grid */}
          {(() => {
            const filteredTodos = activeTab === 'all' ? todos : todos.filter(todo => todo.userId === userId);
            const indexOfLastTodo = currentPage * todosPerPage;
            const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
            const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);
            const totalPages = Math.ceil(filteredTodos.length / todosPerPage);
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" style={{ width: '90vw',  margin: 0, padding: 0, boxSizing: 'border-box', overflowX: 'hidden', justifyContent: 'flex-start' }}>
                  {currentTodos.map(todo => (
                    <div
                      key={todo.id}
                      className="bg-white p-8 flex flex-col justify-between transition-all duration-300 transform hover:scale-105"
                    >
                      {/* ...existing card content... */}
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className={`text-2xl font-bold mb-2 ${todo.completed ? 'text-gray-400 line-through' : 'text-green-700'}`}>{todo.title}</h3>
                          <p className={`text-base ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>{todo.description}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase shadow ${todo.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{todo.completed ? 'Terminée' : 'En cours'}</span>
                      </div>
                      <div className="flex gap-4 justify-end items-center">
                        {!todo.completed && (
                          <button onClick={() => handleComplete(todo.id)} title="Marquer comme terminée" className="text-green-600 hover:text-green-800 transition"><CheckCircle2 className="w-7 h-7" /></button>
                        )}
                        <button onClick={() => handleEdit(todo)} title="Modifier la tâche" className="text-yellow-600 hover:text-yellow-800 transition"><Pencil className="w-7 h-7" /></button>
                        <button onClick={() => handleDelete(todo.id)} title="Supprimer la tâche" className="text-red-600 hover:text-red-800 transition"><Trash2 className="w-7 h-7" /></button>
                        <button onClick={() => setShareTodoId(todo.id)} title="Partager la tâche" className="text-orange-600 hover:text-orange-800 transition"><Share2 className="w-7 h-7" /></button>
                      </div>
                      {editTodoId === todo.id && (
                        <form className="mt-6 border-t pt-6" onSubmit={handleEditSubmit}>
                          <h4 className="text-base font-semibold mb-3 text-purple-700">Modifier</h4>
                          <input type="text" value={editTodo.title} onChange={e => setEditTodo({ ...editTodo, title: e.target.value })} className="w-full border p-3 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg" required />
                          <textarea value={editTodo.description} onChange={e => setEditTodo({ ...editTodo, description: e.target.value })} className="w-full border p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg" placeholder="Description (optionnelle)" />
                          <div className="flex gap-3">
                            <button type="submit" className="flex-1 bg-yellow-500 text-white p-3 rounded-xl shadow hover:bg-yellow-600 transition text-lg font-bold">Enregistrer</button>
                            <button type="button" onClick={() => setEditTodoId(null)} className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-xl hover:bg-gray-400 transition text-lg font-bold">Annuler</button>
                          </div>
                        </form>
                      )}
                      {shareTodoId === todo.id && (
                        <div className="mt-6 border-t pt-6 flex flex-col items-center w-full">
                          <h4 className="text-base font-semibold mb-3 text-orange-700">Partager avec un utilisateur</h4>
                          <div className="flex flex-col sm:flex-row gap-3 w-full min-w-0">
                            <input type="text" placeholder="Email de l'utilisateur" value={shareId} onChange={e => setShareId(e.target.value)} className="flex-1 min-w-0 border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-lg" />
                            <button onClick={() => { const userToShare = users.find(u => u.email === shareId); if (!userToShare) { setShareMsg('Utilisateur non trouvé'); return; } handleShare(todo.id, userToShare.id); }} className="bg-orange-600 text-white p-3 rounded-xl shadow hover:bg-orange-700 transition text-lg font-bold min-w-0">Partager</button>
                          </div>
                          {shareMsg && <span className={`mt-3 text-base font-semibold ${shareMsg.includes('Erreur') ? 'text-red-500' : 'text-green-600'}`}>{shareMsg}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* Pagination controls */}
                <div className="flex justify-center items-center mt-8 gap-2">
                  <button
                    className="px-4 py-2 rounded-lg bg-orange-100 text-orange-700 font-semibold shadow hover:bg-orange-200 disabled:opacity-50"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </button>
                  <span className="px-3 py-2 text-lg font-bold text-orange-700">Page {currentPage} / {totalPages}</span>
                  <button
                    className="px-4 py-2 rounded-lg bg-orange-100 text-orange-700 font-semibold shadow hover:bg-orange-200 disabled:opacity-50"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </button>
                </div>
              </>
            );
          })()}
        </>
      )}

      {activeTab === 'historique' && (
  <div className="bg-white p-8 rounded-2xl shadow-2xl border border-green-100 w-full">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-green-700"><History className="w-8 h-8 text-orange-500" /> Historique des activités</h2>
          {error && <div className="text-red-500 mb-3 text-lg font-semibold">{error}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full text-base rounded-xl overflow-hidden">
              <thead className="bg-orange-100">
                <tr className="text-left text-orange-700 uppercase tracking-wider">
                  <th className="px-5 py-4 font-semibold">Action</th>
                  <th className="px-5 py-4 font-semibold">Utilisateur</th>
                  <th className="px-5 py-4 font-semibold">Todo</th>
               
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {historique.map(item => {
                  const user = users.find(u => u.id === item.userId);
                  return (
                    <tr key={item.id} className="hover:bg-green-50 transition">
                      <td className="px-5 py-4 text-blue-700 font-medium">{item.action}</td>
                      <td className="px-5 py-4 text-gray-700">{user ? user.nom || user.name || user.email : item.userId}</td>
                      <td className="px-5 py-4 text-gray-700">{item.todoId || '-'}</td>
                   
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-gray-400 mt-12 text-base">
        &copy; {new Date().getFullYear()} Todos App. Tous droits réservés.
      </div>
    </div>
  );
};

export default Todos;