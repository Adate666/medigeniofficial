
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, CheckCircle, XCircle, Clock, User, ChevronRight, LogOut, Phone, Mail, Sparkles, Send, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMedical } from '../context/MedicalContext';
import { geminiService } from '../services/geminiService';

const DoctorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { appointments, updateAppointmentStatus, deleteAppointment } = useMedical();
  const navigate = useNavigate();
  
  // State for AI "Avis Rapide"
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAiConsult = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!aiQuery.trim()) return;

      setAiLoading(true);
      setAiResponse('');
      
      try {
        const response = await geminiService.chat(
            `En tant qu'assistant médical pour un médecin, réponds de manière très concise (max 3 phrases) à cette question clinique ou pharmacologique : ${aiQuery}`
        );
        setAiResponse(response);
      } catch (err) {
        setAiResponse("Erreur de connexion à l'assistant.");
      } finally {
        setAiLoading(false);
      }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
       {/* Header with Logout */}
       <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portail Professionnel</h1>
        <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
        >
            <LogOut className="w-4 h-4" />
            Déconnexion
        </button>
      </div>

      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Espace Médecin</h2>
            <p className="text-gray-500 dark:text-gray-400">{user?.name || 'Dr. Inconnu'}</p>
        </div>
        <div className="text-right hidden sm:block">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{appointments.filter(a => a.status === 'pending').length}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Demandes en attente</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-blue-500" />
                Demandes de consultation
            </h2>

            <div className="space-y-4">
                {appointments.length === 0 && (
                    <div className="text-center p-10 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700 text-gray-500">
                        <CalendarCheck className="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p>Aucune demande pour le moment.</p>
                    </div>
                )}
                {appointments.map((apt) => (
                    <div key={apt.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col transition-all hover:shadow-md">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{apt.patientName}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        <Clock className="w-3 h-3" />
                                        Statut: {apt.date}
                                    </div>
                                    <div className="mt-3 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-lg inline-block w-full sm:w-auto">
                                        <strong>Motif :</strong> {apt.reason}
                                    </div>
                                    
                                    {/* COORDONNÉES VISIBLES IMMÉDIATEMENT */}
                                    {apt.patientContact && (
                                        <div className="mt-3 flex flex-wrap gap-3 text-sm">
                                            <a href={`mailto:${apt.patientContact.email}`} className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                                <Mail className="w-3.5 h-3.5" />
                                                {apt.patientContact.email}
                                            </a>
                                            <a href={`tel:${apt.patientContact.phone}`} className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                                <Phone className="w-3.5 h-3.5" />
                                                {apt.patientContact.phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-row sm:flex-col justify-center gap-2 pt-4 sm:pt-0 min-w-[140px]">
                                {apt.status === 'pending' ? (
                                    <>
                                        <button 
                                            onClick={() => updateAppointmentStatus(apt.id, 'accepted')}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Accepter
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if(window.confirm('Refuser ce rendez-vous ?')) {
                                                    deleteAppointment(apt.id);
                                                }
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Refuser
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <span className={`px-4 py-2 rounded-lg text-sm font-bold text-center border ${
                                            apt.status === 'accepted' 
                                            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                                            : 'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}>
                                            {apt.status === 'accepted' ? 'Accepté' : 'Terminé'}
                                        </span>
                                        {apt.status === 'accepted' && (
                                            <button 
                                                onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                                                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 underline text-center"
                                            >
                                                Marquer terminé
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <h3 className="font-bold text-lg">Avis Rapide IA</h3>
                </div>
                <p className="text-sm opacity-90 mb-4">Vérifiez rapidement une interaction ou une posologie.</p>
                
                {!showAiModal ? (
                    <button 
                        onClick={() => setShowAiModal(true)}
                        className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors border border-white/30"
                    >
                        Ouvrir l'Assistant
                    </button>
                ) : (
                    <form onSubmit={handleAiConsult} className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                        <textarea
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            placeholder="Ex: Effets secondaires Amoxicilline..."
                            className="w-full bg-white/90 text-gray-900 text-sm rounded p-2 mb-2 h-20 outline-none"
                        />
                        <div className="flex justify-between items-center">
                            <button 
                                type="button" 
                                onClick={() => setShowAiModal(false)}
                                className="text-xs opacity-70 hover:opacity-100"
                            >
                                Fermer
                            </button>
                            <button 
                                type="submit" 
                                disabled={aiLoading}
                                className="bg-white text-blue-600 px-3 py-1 rounded text-xs font-bold hover:bg-gray-100 flex items-center gap-1"
                            >
                                {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                Analyser
                            </button>
                        </div>
                    </form>
                )}
                
                {aiResponse && (
                    <div className="mt-3 bg-white/90 text-gray-800 text-sm p-3 rounded-lg animate-fade-in">
                        <strong>Réponse :</strong> {aiResponse}
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Derniers dossiers</h3>
                <ul className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <li key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer group transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                                    P{i}
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Dossier #{10230 + i}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                        </li>
                    ))}
                </ul>
            </div>
          </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
