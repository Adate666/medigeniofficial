
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Activity, Stethoscope, ArrowRight, Star, Clock, MapPin, Calendar, CheckCircle, X, Loader2 } from 'lucide-react';
import { mockDoctors, Appointment, Doctor } from '../services/mockData';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useMedical } from '../context/MedicalContext';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { openAuthModal } = useUI();
  const { addAppointment } = useMedical();
  const navigate = useNavigate();

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [reason, setReason] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const initiateBooking = (doctor: Doctor) => {
    if (!isAuthenticated) {
        openAuthModal('register');
    } else {
        setSelectedDoctor(doctor);
        setReason('');
    }
  };

  const confirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !user) return;
    if (!reason.trim()) {
        alert("Veuillez indiquer un motif.");
        return;
    }

    setBookingLoading(true);
    // Simuler délai réseau
    await new Promise(resolve => setTimeout(resolve, 600));

    const newAppointment: Appointment = {
        id: `apt_${Date.now()}`,
        patientId: user.id,
        patientName: user.name,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        reason: reason,
        date: "À définir",
        status: 'pending',
        patientContact: {
            email: user.email,
            phone: user.phone || 'Non renseigné'
        }
    };

    addAppointment(newAppointment);
    setBookingLoading(false);
    setSelectedDoctor(null);
    navigate('/dashboard/patient');
  };

  return (
    <div className="space-y-12 animate-fade-in relative">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
          Votre santé, <span className="text-blue-600 dark:text-blue-400">notre priorité IA</span>.
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300">
          Medigeni combine l'intelligence artificielle avancée avec des outils médicaux pratiques pour vous aider à mieux comprendre votre corps.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/chat"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all"
          >
            Discuter avec l'IA
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            to="/symptoms"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-slate-600 text-base font-medium rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
          >
            Analyser mes symptômes
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-slate-700">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Chatbot IA 24/7</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Posez toutes vos questions de santé à notre assistant intelligent alimenté par Gemini. Disponible à tout moment.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-slate-700">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Analyse de Symptômes</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Décrivez ce que vous ressentez et obtenez une analyse préliminaire instantanée et des conseils de premiers secours.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-slate-700">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Suivi Santé</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Outils intégrés pour calculer votre IMC et suivre votre cycle menstruel avec précision.
          </p>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-10">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Nos Médecins Partenaires</h2>
            <Link to="/chat" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                Voir plus <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
            {mockDoctors.map((doc) => (
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
                            {isAuthenticated ? 'Prendre rendez-vous' : 'Connexion requise'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* BOOKING MODAL (Same as Dashboard for consistency) */}
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

export default Home;
