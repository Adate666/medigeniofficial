
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  MessageSquare, 
  Scale, 
  CalendarHeart, 
  Stethoscope, 
  Menu, 
  X, 
  Moon, 
  Sun,
  User,
  LayoutDashboard
} from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Utilisation du UIContext au lieu d'un state local
  const { isAuthModalOpen, closeAuthModal, openAuthModal } = useUI();
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => location.pathname === path;

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'doctor': return '/dashboard/doctor';
      case 'patient': return '/dashboard/patient';
      default: return '/';
    }
  };

  const navItems = [
    { path: '/', label: 'Accueil', icon: <Activity className="w-5 h-5" /> },
    { path: '/chat', label: 'Assistant IA', icon: <MessageSquare className="w-5 h-5" /> },
    { path: '/symptoms', label: 'Symptômes', icon: <Stethoscope className="w-5 h-5" /> },
    { path: '/bmi', label: 'Calcul IMC', icon: <Scale className="w-5 h-5" /> },
    { path: '/cycles', label: 'Menstruation', icon: <CalendarHeart className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2" onClick={closeMenu}>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  M
                </div>
                <span className="font-bold text-xl text-blue-900 dark:text-blue-400">Medigeni</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-2"></div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700 focus:outline-none"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {isAuthenticated ? (
                <Link 
                  to={getDashboardPath()}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Mon Espace
                </Link>
              ) : (
                <button 
                  onClick={() => openAuthModal('login')}
                  className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-medium text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  Connexion
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden gap-2">
              <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700 focus:outline-none"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMenuOpen ? <X className="block w-6 h-6" /> : <Menu className="block w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`flex items-center gap-2 block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <hr className="my-2 border-gray-200 dark:border-slate-700" />
              
              {isAuthenticated ? (
                <Link 
                  to={getDashboardPath()}
                  onClick={closeMenu}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Mon Espace
                </Link>
              ) : (
                <button 
                  onClick={() => {
                      closeMenu();
                      openAuthModal('login');
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <User className="w-5 h-5" />
                  Connexion
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Medigeni. Attention : Ce site utilise une IA à titre informatif. Consultez toujours un médecin.
          </p>
        </div>
      </footer>

      {/* Auth Modal connecté au UIContext */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
};

export default Layout;
