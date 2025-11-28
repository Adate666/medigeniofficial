
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Appointment, mockAppointments } from '../services/mockData';

interface HealthData {
  lastBMI: number | null;
  cycleLength: number | null;
}

interface MedicalContextType {
  healthData: HealthData;
  updateBMI: (bmi: number) => void;
  updateCycleLength: (length: number) => void;
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: 'accepted' | 'completed' | 'pending') => void;
  deleteAppointment: (id: string) => void;
}

const MedicalContext = createContext<MedicalContextType | undefined>(undefined);

export const MedicalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [healthData, setHealthData] = useState<HealthData>({
    lastBMI: null,
    cycleLength: null,
  });
  
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  const updateBMI = (bmi: number) => {
    setHealthData(prev => ({ ...prev, lastBMI: bmi }));
  };

  const updateCycleLength = (length: number) => {
    setHealthData(prev => ({ ...prev, cycleLength: length }));
  };

  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [appointment, ...prev]);
  };

  const updateAppointmentStatus = (id: string, status: 'accepted' | 'completed' | 'pending') => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status } : app
    ));
  };
  
  const deleteAppointment = (id: string) => {
      setAppointments(prev => prev.filter(app => app.id !== id));
  };

  return (
    <MedicalContext.Provider value={{ 
      healthData, 
      updateBMI, 
      updateCycleLength, 
      appointments, 
      addAppointment,
      updateAppointmentStatus,
      deleteAppointment
    }}>
      {children}
    </MedicalContext.Provider>
  );
};

export const useMedical = () => {
  const context = useContext(MedicalContext);
  if (context === undefined) {
    throw new Error('useMedical must be used within a MedicalProvider');
  }
  return context;
};
