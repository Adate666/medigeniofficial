
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Stethoscope, Star, Clock, MapPin, Search, LogOut, Calendar, CheckCircle, X, Loader2 } from 'lucide-react';
import { mockDoctors, Appointment, Doctor } from '../services/mockData';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useMedical } from '../context/MedicalContext';

const PatientDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour le modal de réservation
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [reason, setReason] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();
  const { openAuthModal } = useUI();
  const { healthData, addAppointment, appointments } = useMedical();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initiateBooking = (doctor: Doctor) => {
      if (!isAuthenticated) {
          openAuthModal('register');
          return;
      }
      setSelectedDoctor(doctor);
      setReason('');
  };

  const confirmBooking = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedDoctor || !user) return;
      if (!reason.trim()) {
          alert("Veuillez indiquer un motif.");
          return;
      }

      setBookingLoading(true);

      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 600));

      const newAppointment: Appointment = {
          id: `apt_${Date.now()}`,
          patientId: user.id,
          patientName: user.name,
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          reason: reason,
          date: "À définir avec le médecin",
          status: 'pending',
          patientContact: {
              email: user.email,
              phone: user.phone || 'Non renseigné'
          }
      };

      addAppointment(newAppointment);
      setBookingLoading(false);
      setSelectedDoctor(null);
      // Feedback visuel ou scroll vers les RDV
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredDoctors = mockDoctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter my appointments
  const myAppointments = appointments.filter(a => a.patientId === user?.id);

  return (
    <div className="space-y-10 animate-fade-in relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mon Espace Patient</h1>
        <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
        >
            <LogOut className="w-4 h-4" />
            Déconnexion
        </button>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Bonjour, {user?.name || 'Patient'}</h1>
        <p className="opacity-90">Voici un aperçu de votre santé aujourd'hui.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Link to="/chat" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-xl transition-all border border-white/20">
                <MessageSquare className="w-6 h-6 mb-2" />
                <span className="font-medium text-sm">Chatbot IA</span>
            </Link>
            <Link to="/symptoms" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-xl transition-all border border-white/20">
                <Stethoscope className="w-6 h-6 mb-2" />
                <span className="font-medium text-sm">Analyser</span>
            </Link>
            <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                <div className="text-2xl font-bold">{healthData.lastBMI ? healthData.lastBMI.toFixed(1) : '--'}</div>
                <span className="text-xs opacity-70">Dernier IMC</span>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                <div className="text-lg font-bold">{healthData.cycleLength ? `${healthData.cycleLength} Jours` : '--'}</div>
                <span className="text-xs opacity-70">Cycle Moyen</span>
            </div>
        </div>
      </div>

      {/* Mes Rendez-vous */}
      <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mes Rendez-vous</h2>
          {myAppointments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                  {myAppointments.map(apt => (
                      <div key={apt.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 flex justify-between items-center shadow-sm">
                          <div>
                              <div className="font-bold text-gray-900 dark:text-white">{apt.doctorName}</div>
                              <div className="text-sm text-gray-500">{apt.reason}</div>
                              <div className="text-xs text-blue-500 mt-1">{apt.date}</div>
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1
                                ${apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                                ${apt.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                                ${apt.status === 'completed' ? 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300' : ''}
                            `}>
                                {apt.status === 'pending' && <Clock className="w-3 h-3" />}
                                {apt.status === 'accepted' && <CheckCircle className="w-3 h-3" />}
                                {apt.status === 'pending' && 'En attente'}
                                {apt.status === 'accepted' && 'Confirmé'}
                                {apt.status === 'completed' && 'Terminé'}
                            </span>
                          </div>
                      </div>
                  ))}
              </div>
          ) : (
              <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-8 text-center text-gray-500 border border-dashed border-gray-200 dark:border-slate-700">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>Aucun rendez-vous programmé.</p>
              </div>
          )}
      </div>

      {/* Doctor Showcase */}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nos Médecins Partenaires</h2>
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Chercher un spécialiste..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
                <div key={doc.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 dark:border-slate-700 group flex flex-col">
                    <div className="h-24 bg-blue-50 dark:bg-blue-900/20 relative"></div>
                    <div className="px-6 relative">
                        <img 
                            src={doc.image} 
                            alt={doc.name} 
                            className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-800 absolute -top-10 shadow-sm"
                        />
                    </div>
                    <div className="p-6 pt-12 flex-grow">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{doc.name}</h3>
                                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">{doc.specialty}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded text-xs font-bold text-yellow-700 dark:text-yellow-400">
                                <Star className="w-3 h-3 fill-current" />
                                {doc.rating}
                            </div>
                        </div>
                        
                        <div className="space-y-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{doc.availability}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>Consultation vidéo</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                        <button 
                            onClick={() => initiateBooking(doc)}
                            className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-4 h-4" />
                            Prendre rendez-vous
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* MODAL DE RESERVATION */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                    <h3 className="font-bold text-lg">Prendre rendez-vous</h3>
                    <button onClick={() => setSelectedDoctor(null)} className="hover:bg-blue-700 p-1 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={confirmBooking} className="p-6 space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                        <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-100" />
                        <div>
                            <div className="font-bold text-gray-900 dark:text-white">{selectedDoctor.name}</div>
                            <div className="text-blue-600 dark:text-blue-400 text-sm">{selectedDoctor.specialty}</div>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Motif de la consultation</label>
                        <textarea 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Ex: Douleurs abdominales, renouvellement d'ordonnance..."
                            className="w-full h-32 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            required
                            autoFocus
                        />
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-800 dark:text-blue-200">
                        <p>Vos coordonnées ({user?.email}, {user?.phone || 'Tél non renseigné'}) seront transmises au médecin pour qu'il puisse vous recontacter.</p>
                    </div>

                    <button 
                        type="submit" 
                        disabled={bookingLoading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                    >
                        {bookingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmer la demande'}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
