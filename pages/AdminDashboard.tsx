
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, MessageSquare, CalendarHeart, UserPlus, Trash2, Edit, Search, LogOut } from 'lucide-react';
import { mockStats, mockUsers, User } from '../services/mockData';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'patient' });
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
        id: `u${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as 'patient' | 'doctor' | 'admin',
        status: 'active'
    };
    setUsers([...users, user]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'patient' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Administration</h1>
            <div className="text-sm text-gray-500">Super Admin</div>
        </div>
        <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
        >
            <LogOut className="w-4 h-4" />
            Déconnexion
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Utilisateurs Totaux</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockStats.totalUsers}</p>
          <span className="text-xs text-green-500 flex items-center mt-1">+12% ce mois</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Usage Chatbot</h3>
            <MessageSquare className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockStats.toolUsage.chatbot}</p>
          <span className="text-xs text-gray-400 mt-1">requêtes traitées</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Analyses IMC</h3>
            <Activity className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockStats.toolUsage.bmi}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Cycles Suivis</h3>
            <CalendarHeart className="w-5 h-5 text-pink-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockStats.toolUsage.cycles}</p>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gestion des Utilisateurs</h2>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
                <UserPlus className="w-4 h-4" />
                Créer Utilisateur
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-700 dark:text-gray-300 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">Nom</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Rôle</th>
                <th scope="col" className="px-6 py-3">Statut</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : ''}
                        ${user.role === 'doctor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                        ${user.role === 'patient' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                    `}>
                        {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Actif
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

        {/* Modal Création Client/User */}
        {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                    <h3 className="text-lg font-bold mb-4 dark:text-white">Créer un nouveau compte</h3>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Nom complet</label>
                            <input 
                                type="text" 
                                required
                                value={newUser.name}
                                onChange={e => setNewUser({...newUser, name: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input 
                                type="email" 
                                required
                                value={newUser.email}
                                onChange={e => setNewUser({...newUser, email: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Rôle</label>
                            <select 
                                value={newUser.role}
                                onChange={e => setNewUser({...newUser, role: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                            >
                                <option value="patient">Patient</option>
                                <option value="doctor">Médecin</option>
                                <option value="admin">Administrateur</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button 
                                type="button" 
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700 rounded-lg"
                            >
                                Annuler
                            </button>
                            <button 
                                type="submit" 
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Créer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default AdminDashboard;
