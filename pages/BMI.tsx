
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useMedical } from '../context/MedicalContext';

const BMI: React.FC = () => {
  const [height, setHeight] = useState<string>(''); // cm
  const [weight, setWeight] = useState<string>(''); // kg
  const [bmi, setBmi] = useState<number | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { updateBMI } = useMedical();

  const calculateBMI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!height || !weight) return;

    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (h <= 0 || w <= 0) return;

    const heightInMeters = h / 100;
    const bmiValue = w / (heightInMeters * heightInMeters);
    setBmi(bmiValue);
    updateBMI(bmiValue); // Sauvegarder dans le contexte
    
    // Call AI for interpretation
    setLoading(true);
    setAiAnalysis('');
    
    try {
      const analysis = await geminiService.analyzeBMI(bmiValue, h, w);
      setAiAnalysis(analysis);
    } catch (err) {
      setAiAnalysis("Erreur lors de la récupération des conseils IA.");
    } finally {
      setLoading(false);
    }
  };

  const getBMIColor = (value: number) => {
    if (value < 18.5) return 'text-blue-500 border-blue-500';
    if (value < 25) return 'text-green-500 border-green-500';
    if (value < 30) return 'text-orange-500 border-orange-500';
    return 'text-red-500 border-red-500';
  };

  const getBMICategory = (value: number) => {
    if (value < 18.5) return 'Insuffisance pondérale';
    if (value < 25) return 'Poids normal';
    if (value < 30) return 'Surpoids';
    return 'Obésité';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calculateur IMC & Analyse IA</h1>
        <p className="text-gray-500 dark:text-gray-400">Calculez votre Indice de Masse Corporelle et recevez des conseils personnalisés.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 h-fit">
          <form onSubmit={calculateBMI} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Taille (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="ex: 175"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Poids (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="ex: 70"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Calculer et Analyser'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {bmi !== null && (
            <div className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border-2 text-center ${getBMIColor(bmi)}`}>
              <div className="text-sm font-medium uppercase tracking-wide opacity-80 text-gray-500 dark:text-gray-400">Votre IMC</div>
              <div className="text-5xl font-bold my-2">{bmi.toFixed(1)}</div>
              <div className="text-xl font-medium">{getBMICategory(bmi)}</div>
            </div>
          )}

          {loading && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
            </div>
          )}

          {aiAnalysis && !loading && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="text-blue-600 w-6 h-6" />
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Analyse de Medigeni</h3>
              </div>
              <div className="prose prose-sm dark:prose-invert text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {aiAnalysis}
              </div>
            </div>
          )}
          
          {!bmi && !loading && (
            <div className="flex items-center justify-center h-full text-gray-400 p-8 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl">
              <span className="flex items-center gap-2"><AlertCircle className="w-5 h-5"/> Entrez vos données pour voir les résultats</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BMI;
