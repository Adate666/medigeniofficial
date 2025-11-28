
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  status: 'active' | 'inactive';
  phone?: string;
}

export interface Doctor extends User {
  specialty: string;
  availability: string;
  image: string;
  rating: number;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  reason: string;
  date: string;
  status: 'pending' | 'accepted' | 'completed';
  patientContact?: {
    email: string;
    phone: string;
  };
}

export const mockStats = {
  totalUsers: 1250,
  activeDoctors: 45,
  dailyConsultations: 128,
  toolUsage: {
    chatbot: 4500,
    bmi: 1200,
    symptoms: 890,
    cycles: 650
  }
};

export const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sophie Martin',
    email: 'sophie.martin@medigeni.com',
    role: 'doctor',
    status: 'active',
    specialty: 'Généraliste',
    availability: 'Lun - Ven, 9h - 17h',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    rating: 4.8,
    phone: '01 23 45 67 89'
  },
  {
    id: 'd2',
    name: 'Dr. Jean Dupont',
    email: 'jean.dupont@medigeni.com',
    role: 'doctor',
    status: 'active',
    specialty: 'Cardiologue',
    availability: 'Mar - Jeu, 10h - 18h',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    rating: 4.9,
    phone: '01 98 76 54 32'
  },
  {
    id: 'd3',
    name: 'Dr. Amel Ben Ali',
    email: 'amel.benali@medigeni.com',
    role: 'doctor',
    status: 'active',
    specialty: 'Pédiatre',
    availability: 'Lun - Mer - Ven, 8h - 16h',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300',
    rating: 4.7,
    phone: '06 11 22 33 44'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    patientName: 'Thomas Leroy',
    patientId: 'p1',
    doctorId: 'd1',
    doctorName: 'Dr. Sophie Martin',
    reason: 'Fièvre persistante et toux',
    date: 'Aujourd\'hui, 14:30',
    status: 'pending',
    patientContact: {
      email: 'patient@medigeni.com',
      phone: '06 12 34 56 78'
    }
  },
  {
    id: 'a2',
    patientName: 'Marie Curie',
    patientId: 'p2',
    doctorId: 'd1',
    doctorName: 'Dr. Sophie Martin',
    reason: 'Renouvellement ordonnance',
    date: 'Demain, 09:15',
    status: 'accepted',
    patientContact: {
      email: 'marie@test.com',
      phone: '07 89 10 11 12'
    }
  }
];

export const mockUsers: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@medigeni.com', role: 'admin', status: 'active', phone: '0000000000' },
  ...mockDoctors,
  { id: 'p1', name: 'Thomas Leroy', email: 'patient@medigeni.com', role: 'patient', status: 'active', phone: '06 12 34 56 78' },
  { id: 'p2', name: 'Marie Curie', email: 'marie@test.com', role: 'patient', status: 'active', phone: '07 89 10 11 12' },
];

// Stockage temporaire des mots de passe pour les nouveaux utilisateurs inscrits
const tempPasswords: Record<string, string> = {
    'admin@medigeni.com': 'admin123',
    'medecin@medigeni.com': 'medecin123',
    'patient@medigeni.com': 'patient123'
};

export const addUser = (user: User, password: string) => {
    mockUsers.push(user);
    tempPasswords[user.email.toLowerCase()] = password;
};

export const verifyCredentials = (email: string, password: string): User | null => {
  const lowerEmail = email.toLowerCase().trim();
  
  let user = mockUsers.find(u => u.email.toLowerCase() === lowerEmail);

  if (!user && lowerEmail === 'medecin@medigeni.com') {
     user = { id: 'd_test', name: 'Dr. Test', email: 'medecin@medigeni.com', role: 'doctor', status: 'active', phone: '0101010101' };
  }
  
  if (user && tempPasswords[lowerEmail] === password) {
    return user;
  }

  return null;
};
