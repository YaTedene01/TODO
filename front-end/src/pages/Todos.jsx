
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { ClipboardList, CheckCircle2, Pencil, Trash2, Share2, History, Fullscreen, Mic } from 'lucide-react';

const Todos = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [users, setUsers] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem('userId'));
  const [newTodo, setNewTodo] = useState({ title: '', description: '', image: null, audio: null, endTime: '' });
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [finishedAlert, setFinishedAlert] = useState(null);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const finishedTodos = todos.filter(todo =>
        todo.endTime && new Date(todo.endTime) <= now && !todo.completed && todo.userId === userId
      );
      if (finishedTodos.length > 0) {
        setFinishedAlert(`La tâche "${finishedTodos[0].title}" est terminée !`);
      } else {
        setFinishedAlert(null);
      }
    }, 10000); 
    return () => clearInterval(interval);
  }, [todos, userId]);
  const startRecording = async () => {
    setError('');
    setAudioURL(null);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setNewTodo(todo => ({ ...todo, audio: audioBlob }));
        setAudioURL(URL.createObjectURL(audioBlob));
      };
      mediaRecorder.start();
      setIsRecording(true);
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 30000);
    } catch (err) {
      setError("Impossible d'accéder au micro");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  const [error, setError] = useState('');
  const [shareId, setShareId] = useState('');
  const [shareTodoId, setShareTodoId] = useState(null);
  const [shareMsg, setShareMsg] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodo, setEditTodo] = useState({ title: '', description: '' });
  const [fetchId, setFetchId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 6;

  const fetchTodos = async () => {
    try {
      const data = await apiRequest('/api/todo');
      setTodos(data);
    } catch (err) {
      setError('Erreur lors du chargement des todos');
    }
  };

  useEffect(() => {
    apiRequest('/api/user/me')
      .then(setCurrentUser)
      .catch(() => {});
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchTodos();
    apiRequest('/api/historique')
      .then(setHistorique)
      .catch(() => setError('Erreur lors du chargement de l\'historique'));
    apiRequest('/api/user')
      .then(setUsers)
      .catch(() => {});
  }, [navigate]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (!newTodo.title.trim() || !newTodo.description.trim()) {
      setError('Le titre et la description sont obligatoires.');
      return;
    }
    if (!newTodo.endTime) {
      setError('La date et l\'heure de fin sont obligatoires.');
      return;
    }
    try {
      const formData = new FormData();
  formData.append('title', newTodo.title);
  formData.append('description', newTodo.description);
  formData.append('completed', false);
  formData.append('endTime', newTodo.endTime);
  if (newTodo.image) formData.append('image', newTodo.image);
  if (newTodo.audio) formData.append('audio', newTodo.audio);
      await apiRequest('/api/todo/upload', {
        method: 'POST',
        body: formData,
      });
  setNewTodo({ title: '', description: '', image: null, audio: null, endTime: '' });
      fetchTodos();
    } catch (err) {
      let msg = '';
      if (err.errors && Array.isArray(err.errors)) {
        msg = err.errors.map(e => e.message).join(' | ');
      } else if (err.error) {
        msg = err.error;
      } else {
        msg = err.message || "Erreur lors de l'ajout";
      }
      setError(msg);
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
  <div className="min-h-[60vh] bg-white p-2 overflow-hidden" style={{ width: '100vw', maxWidth: '100vw' }}>
      <div className="relative mb-4">
        <div className="absolute  right-5 flex-items-center">
          {currentUser && (
            <>
              <img src={currentUser.imageUrl || '/vite.svg'} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-green-300" />
              <span className="font-bold text-green-700 text-base">{currentUser.name || currentUser.nom || currentUser.email}</span>
            </>
          )}
        </div>
        <div className="flex gap-1 items-center sm:gap-2">
          <button
            className={`flex items-center gap-1 px-2 py-1 rounded-lg font-semibold border border-green-600 bg-gradient-to-r from-green-100 to-green-300 text-green-700 shadow hover:from-green-200 hover:to-green-400 transition-all text-xs ${activeTab === 'all' ? 'font-bold ring-2 ring-green-400' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <ClipboardList className="w-4 h-4" /> Toutes les Taches
          </button>
          <button
            className={`flex items-center gap-1 px-2 py-1 rounded-lg font-semibold border border-green-600 bg-gradient-to-r from-green-100 to-green-300 text-green-700 shadow hover:from-green-200 hover:to-green-400 transition-all text-xs ${activeTab === 'user' ? 'font-bold ring-2 ring-green-400' : ''}`}
            onClick={() => setActiveTab('user')}
          >
            <ClipboardList className="w-4 h-4" /> Mes Taches
          </button>
          <button
            className={`flex items-center gap-1 px-2 py-1 rounded-lg font-semibold border border-green-600 bg-gradient-to-r from-green-100 to-green-300 text-green-700 shadow hover:from-green-200 hover:to-green-400 transition-all text-xs ${activeTab === 'historique' ? 'font-bold ring-2 ring-green-400' : ''}`}
            onClick={() => setActiveTab('historique')}
          >
            <History className="w-4 h-4" /> Historique
          </button>
        </div>
      </div>

      {(activeTab === 'all' || activeTab === 'user') && (
        <>
          {finishedAlert && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-base font-bold animate-bounce">
              {finishedAlert}
            </div>
          )}
          <div className="mb-2 w-full flex justify-center items-center mx-auto">
            <form className="w-full max-w-xs bg-white flex flex-col items-center p-2 rounded-xl shadow  border-4 border-green-200 aspect-square" onSubmit={handleAdd}>
              <h2 className="text-base font-bold text-green-700 mb-1">Ajouter une tâche</h2>

              <input
                type="text"
                placeholder="Titre du todo"
                value={newTodo.title}
                onChange={e => setNewTodo({ ...newTodo, title: e.target.value })}
                className="w-full border-2 border-green-300 py-4 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-base mb-1"
                autoComplete="off"
              />
              
              <textarea
                placeholder="Description"
                value={newTodo.description}
                onChange={e => setNewTodo({ ...newTodo, description: e.target.value })}
                className="w-full border-2 border-green-300 py-2 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-base mb-1"
                rows={2}
                autoComplete="off"
              />
              <label className="w-full text-xs font-semibold text-green-700 mb-1">Date et heure de fin</label>
              <input
                type="datetime-local"
                value={newTodo.endTime}
                onChange={e => setNewTodo({ ...newTodo, endTime: e.target.value })}
                className="w-full border-2 border-green-300 py-2 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-base mb-1"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={e => setNewTodo({ ...newTodo, image: e.target.files[0] })}
                className="w-full border-2 border-green-300 py-4 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base mb-2"
                style={{ fontSize: '1rem', height: '4rem' }}
              />
              <div className="w-full flex flex-col items-center mb-2">
                {isRecording ? (
                  <button type="button" onClick={stopRecording} className="bg-red-500 text-white p-2 rounded-full mb-1 flex items-center justify-center" title="Arrêter l'enregistrement">
                    <Mic className="w-5 h-5" />
                  </button>
                ) : (
                  <button type="button" onClick={startRecording} className="bg-green-500 text-white p-2 rounded-full mb-1 flex items-center justify-center" title="Enregistrer un audio">
                    <Mic className="w-5 h-5" />
                  </button>
                )}
                {audioURL && (
                  <audio controls src={audioURL} className="mt-2 w-full" />
                )}
              </div>
              {error && error !== "Vous n'avez pas les droits nécessaires" && (
                <div className="text-red-500 text-center font-medium mb-2">{error}</div>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg shadow hover:from-green-600 hover:to-green-800 text-base font-bold"
              >
                Ajouter
              </button>
            </form>
          </div>

          {/*  */}
          {error === "Vous n'avez pas les droits nécessaires" && (
            <div className="w-full text-center text-red-500 font-bold my-2">{error}</div>
          )}

          {(() => {
            let filteredTodos = activeTab === 'all' ? todos : todos.filter(todo => todo.userId === userId);
            filteredTodos = filteredTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const indexOfLastTodo = currentPage * todosPerPage;
            const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
            const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);
            const totalPages = Math.ceil(filteredTodos.length / todosPerPage);
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 w-full" style={{ width: '100%', margin: 0, padding: 0, boxSizing: 'border-box' }}>
                  {currentTodos.map(todo => (
                    <div
                      key={todo.id}
                      className="bg-white p-1 flex flex-col justify-between transition-all duration-300 hover:scale-105 rounded-lg border-2 border-green-400 w-full h-full" style={{ height: '260px', minHeight: '260px', maxHeight: '260px', minWidth: '0', position: 'relative' }}
                    >
                      <div className="absolute top-2 left-2 z-10 flex flex-col items-start text-xs text-gray-600 bg-white/80 rounded px-2 py-1 shadow">
                        <span>Date de début : {todo.createdAt ? `${new Date(todo.createdAt).toLocaleDateString()} ${new Date(todo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '-'}</span>
                        <span>Date de fin : {
                          todo.endTime
                            ? (() => {
                                const dt = new Date(todo.endTime);
                                if (isNaN(dt.getTime())) return '-';
                                return `${dt.toLocaleDateString()} ${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                              })()
                            : '-'
                        }</span>
                      </div>
                      <div className="absolute top-2 right-2 z-10 flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-green-200 shadow">
                        <img
                          src={todo.imageUrl ? `http://localhost:3010${todo.imageUrl}` : '/vite.svg'}
                          alt="Todo"
                          className="w-full h-full object-cover"
                          onError={e => { e.target.src = '/vite.svg'; }}
                        />
                      </div>
                      {todo.audioUrl && (
                        <div className="flex justify-center items-center w-full mb-2" style={{ position: 'absolute', left: 0, right: 0, top: '40%', transform: 'translateY(-50%)' }}>
                          <audio controls src={`http://localhost:3010${todo.audioUrl}`} style={{ width: '180px', height: '40px' }} />
                        </div>
                      )}
                      <div className="absolute bottom-10 left-2 flex flex-col items-start text-left">
                        <h3 className={`text-base font-bold mb-1 ${todo.completed ? 'text-gray-400 line-through' : 'text-green-700'}`}>{todo.title}</h3>
                        <p className={`text-xs ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>{todo.description}</p>
                        {editTodoId === todo.id && (
                          <div style={{ margin:'0px' }}>
                            <form className="mt-1 border-t pt-1 max-w-[140px]" onSubmit={handleEditSubmit} style={{ fontSize: '0.85rem' }}>
                            <h4 className="text-xs font-semibold mb-1 text-green-700">Modifier</h4>
                            <input type="text" value={editTodo.title} onChange={e => setEditTodo({ ...editTodo, title: e.target.value })} className="w-full border p-0.5 rounded-lg mb-1 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs" required style={{ fontSize: '0.85rem' }} />
                            <textarea value={editTodo.description} onChange={e => setEditTodo({ ...editTodo, description: e.target.value })} className="w-full border p-0.5 rounded-lg mb-1 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs" placeholder="Description (optionnelle)" style={{ fontSize: '0.85rem', minHeight: '32px' }} />
                            <div className="flex gap-1">
                              <button type="submit" className="flex-1 bg-green-500 text-white p-0.5 rounded-lg shadow hover:bg-yellow-600 transition text-xs font-bold" style={{ fontSize: '0.85rem' }}>Enregistrer</button>
                              <button type="button" onClick={() => setEditTodoId(null)} className="flex-1 bg-gray-300 text-gray-700 p-0.5 rounded-lg hover:bg-gray-400 transition text-xs font-bold" style={{ fontSize: '0.85rem' }}>Annuler</button>
                            </div>
                            </form>
                          </div>
                        )}
                      </div>
                      <span className={`absolute bottom-10 right-2 px-2 py-1 rounded-full text-xs font-semibold uppercase shadow ${todo.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{todo.completed ? 'Terminée' : 'En cours'}</span>
                      <div className="absolute bottom-2 right-2 flex gap-2 items-center">
                        {!todo.completed && (
                          <button onClick={() => handleComplete(todo.id)} title="Marquer comme terminée" className="text-green-600 hover:text-green-800 transition"><CheckCircle2 className="w-5 h-5" /></button>
                        )}
                        <button onClick={() => handleEdit(todo)} title="Modifier la tâche" className="text-yellow-600 hover:text-yellow-800 transition"><Pencil className="w-5 h-5" /></button>
                        <button onClick={() => handleDelete(todo.id)} title="Supprimer la tâche" className="text-red-600 hover:text-red-800 transition"><Trash2 className="w-5 h-5" /></button>
                        <button onClick={() => setShareTodoId(todo.id)} title="Partager la tâche" className="text-orange-600 hover:text-orange-800 transition"><Share2 className="w-5 h-5" /></button>
                      </div>
                      {shareTodoId === todo.id && (
                        <div className="mt-2 border-t pt-2 flex flex-col items-center w-full">
                          <h4 className="text-xs font-semibold mb-1 text-orange-700">Partager avec un utilisateur</h4>
                          <div className="flex flex-col sm:flex-row gap-1 w-full min-w-0">
                            <input type="text" placeholder="Email de l'utilisateur" value={shareId} onChange={e => setShareId(e.target.value)} className="flex-1 min-w-0 border p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-xs" />
                            <button onClick={() => { const userToShare = users.find(u => u.email === shareId); if (!userToShare) { setShareMsg('Utilisateur non trouvé'); return; } handleShare(todo.id, userToShare.id); }} className="bg-orange-600 text-white p-1 rounded-lg shadow hover:bg-orange-700 transition text-xs font-bold min-w-0">Partager</button>
                          </div>
                          {shareMsg && <span className={`mt-1 text-xs font-semibold ${shareMsg.includes('Erreur') ? 'text-red-500' : 'text-green-600'}`}>{shareMsg}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center mt-2 gap-1">
                  <button
                    className="px-2 py-1 rounded bg-gradient-to-r from-green-100 to-green-300 text-green-700 font-semibold shadow hover:from-green-200 hover:to-green-400 disabled:opacity-50 text-xs"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </button>
                  <span className="px-2 py-1 text-xs font-bold text-green-700">Page {currentPage} / {totalPages}</span>
                  <button
                    className="px-2 py-1 rounded bg-gradient-to-r from-green-100 to-green-300 text-green-700 font-semibold shadow hover:from-green-200 hover:to-green-400 disabled:opacity-50 text-xs"
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
        <div className="bg-white p-2 rounded-lg shadow border border-green-100 w-full">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-green-700"><History className="w-4 h-4 text-orange-500" /> Historique des activités</h2>
          {error && <div className="text-red-500 mb-1 text-sm font-semibold">{error}</div>}
          <div>
            <table className="min-w-full text-xs rounded-lg overflow-hidden">
              <thead className="bg-orange-100">
                <tr className="text-left text-orange-700 uppercase tracking-wider">
                  <th className="px-2 py-2 font-semibold">Action</th>
                  <th className="px-2 py-2 font-semibold">Utilisateur</th>
                  <th className="px-2 py-2 font-semibold">Todo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {historique.map(item => {
                  const user = users.find(u => u.id === item.userId);
                  return (
                    <tr key={item.id} className="hover:bg-green-50 transition">
                      <td className="px-2 py-2 text-green-700 font-medium">{item.action}</td>
                      <td className="px-2 py-2 text-gray-700">{user ? user.nom || user.name || user.email : item.userId}</td>
                      <td className="px-2 py-2 text-gray-700">{item.todoId || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-center text-gray-400 mt-4 text-xs">
        &copy; {new Date().getFullYear()} Todos App. Tous droits réservés.
      </div>
    </div>
  );
};

export default Todos;