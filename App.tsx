
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import BMI from './pages/BMI';
import Symptoms from './pages/Symptoms';
import Menstruation from './pages/Menstruation';
import AdminDashboard from './pages/AdminDashboard';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { MedicalProvider } from './context/MedicalContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <UIProvider>
        <MedicalProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chatbot />} />
                <Route path="/bmi" element={<BMI />} />
                <Route path="/symptoms" element={<Symptoms />} />
                <Route path="/cycles" element={<Menstruation />} />
                
                {/* Dashboard Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/dashboard/patient" element={<PatientDashboard />} />
                <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
              </Routes>
            </Layout>
          </Router>
        </MedicalProvider>
      </UIProvider>
    </AuthProvider>
  );
};

export default App;
