
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, Stethoscope, ChevronRight, AlertCircle, Loader2, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { authModalMode } = useUI();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, register } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setIsRegister(authModalMode === 'register');
      setError('');
      // Reset forms
      setEmail(''); setPassword('');
      setRegName(''); setRegEmail(''); setRegPhone(''); setRegPassword('');
    }
  }, [isOpen, authModalMode]);

  if (!isOpen) return null;

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        onClose();
        if (email.includes('admin')) navigate('/admin');
        else if (email.includes('medecin')) navigate('/dashboard/doctor');
        else navigate('/dashboard/patient');
      } else {
        setError("Email ou mot de passe incorrect.");
      }
    } catch (err) {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
      setError('');
      setLoading(true);
      try {
          if(!regName || !regEmail || !regPassword || !regPhone) {
              setError("Tous les champs sont obligatoires");
              setLoading(false);
              return;
          }

          const success = await register(regName, regEmail, regPassword, role, regPhone);
          if (success) {
              onClose();
              if (role === 'doctor') navigate('/dashboard/doctor');
              else navigate('/dashboard/patient');
          } else {
              setError("Erreur lors de l'inscription.");
          }
      } catch (err) {
          setError("Une erreur est survenue.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm h-auto min-h-[450px] [perspective:1000px]">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-50 p-2"
        >
            <X className="w-6 h-6" />
        </button>

        <div 
          className={`relative w-full transition-all duration-700 [transform-style:preserve-3d] ${isRegister ? '[transform:rotateY(180deg)]' : ''}`}
        >
          {/* LOGIN SIDE (Front) */}
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 flex flex-col [backface-visibility:hidden]">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Connexion</h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Accédez à votre espace sécurisé</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                {error && !isRegister && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                <div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            placeholder="Votre adresse email"
                            required
                        />
                    </div>
                </div>
                <div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            placeholder="Mot de passe"
                            required
                        />
                    </div>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-bold text-sm transition-transform active:scale-95 shadow-md mt-2 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Se connecter'}
                </button>
            </form>

            <div className="mt-6 text-center pt-4 border-t border-gray-100 dark:border-slate-700">
                <button 
                    onClick={() => setIsRegister(true)}
                    className="text-xs text-blue-600 font-semibold hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                    Pas encore de compte ? Créer un compte <ChevronRight className="w-3 h-3" />
                </button>
            </div>
          </div>

          {/* REGISTER SIDE (Back) */}
          <div className="absolute top-0 inset-x-0 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Inscription</h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Rejoignez Medigeni</p>
            </div>

            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                 {error && isRegister && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                
                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                        type="button"
                        onClick={() => setRole('patient')}
                        className={`p-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${role === 'patient' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                    >
                        <User className="w-4 h-4" />
                        <span className="text-xs font-bold">Patient</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('doctor')}
                        className={`p-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${role === 'doctor' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                    >
                        <Stethoscope className="w-4 h-4" />
                        <span className="text-xs font-bold">Médecin</span>
                    </button>
                </div>

                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)} 
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="Nom complet"
                        required
                    />
                </div>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)} 
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="Téléphone"
                        required
                    />
                </div>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)} 
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)} 
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="Mot de passe"
                        required
                    />
                </div>
                
                <button type="submit" disabled={loading} className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-transform active:scale-95 shadow-md flex justify-center items-center gap-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "S'inscrire"}
                </button>
            </form>

            <div className="mt-4 text-center pt-3 border-t border-gray-100 dark:border-slate-700">
                <button 
                    onClick={() => setIsRegister(false)}
                    className="text-xs text-blue-600 font-semibold hover:underline"
                >
                    Retour à la connexion
                </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
