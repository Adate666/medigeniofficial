
import React, { useState } from 'react';
import { CalendarHeart, Calendar as CalendarIcon, Droplets, Baby } from 'lucide-react';
import { useMedical } from '../context/MedicalContext';

const Menstruation: React.FC = () => {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(28); // Default 28
  const [results, setResults] = useState<{
    nextPeriod: Date;
    ovulation: Date;
    fertileStart: Date;
    fertileEnd: Date;
  } | null>(null);

  const { updateCycleLength } = useMedical();

  const calculateCycle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastPeriod) return;

    updateCycleLength(cycleLength);

    const lastDate = new Date(lastPeriod);
    
    // Calculate Next Period
    const nextPeriodDate = new Date(lastDate);
    nextPeriodDate.setDate(lastDate.getDate() + cycleLength);

    // Calculate Ovulation (approx 14 days before next period)
    const ovulationDate = new Date(nextPeriodDate);
    ovulationDate.setDate(nextPeriodDate.getDate() - 14);

    // Calculate Fertile Window (Ovulation - 5 days to Ovulation + 1 day)
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 5);
    
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 1);

    setResults({
      nextPeriod: nextPeriodDate,
      ovulation: ovulationDate,
      fertileStart,
      fertileEnd
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Calculateur de Cycle</h1>
        <p className="text-gray-500 dark:text-gray-400">Suivez vos règles et vos périodes de fertilité.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
          <form onSubmit={calculateCycle} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date des dernières règles
              </label>
              <input
                type="date"
                value={lastPeriod}
                onChange={(e) => setLastPeriod(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Durée moyenne du cycle (jours)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="21"
                  max="35"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <span className="font-bold text-pink-600 dark:text-pink-400 min-w-[3rem] text-center">
                  {cycleLength}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <CalendarHeart className="w-5 h-5" />
              Calculer
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {results ? (
            <>
              <div className="bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 p-6 rounded-2xl border border-pink-100 dark:border-pink-900">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-pink-100 dark:bg-pink-800 rounded-full text-pink-600 dark:text-pink-200">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Prochaines règles</h3>
                </div>
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400 ml-12 capitalize">
                  {formatDate(results.nextPeriod)}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-900">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full text-purple-600 dark:text-purple-200">
                    <Baby className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Date d'ovulation estimée</h3>
                </div>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400 ml-12 capitalize">
                  {formatDate(results.ovulation)}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Fenêtre de fertilité</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 ml-12">
                  Du <span className="font-medium text-gray-900 dark:text-white">{results.fertileStart.toLocaleDateString('fr-FR')}</span> au <span className="font-medium text-gray-900 dark:text-white">{results.fertileEnd.toLocaleDateString('fr-FR')}</span>
                </p>
              </div>
            </>
          ) : (
             <div className="h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 text-gray-400 p-8">
               <CalendarHeart className="w-16 h-16 mb-4 opacity-50" />
               <p className="text-center">Entrez la date de vos dernières règles pour voir les prévisions.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menstruation;
