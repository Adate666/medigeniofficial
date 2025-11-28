import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { Loader2, AlertTriangle, Stethoscope } from 'lucide-react';

const Symptoms: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setResult('');

    try {
      const analysis = await geminiService.analyzeSymptoms(symptoms, additionalInfo);
      setResult(analysis);
    } catch (error) {
      setResult("Impossible de contacter le service d'analyse. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-200">
              <strong>Avertissement Important :</strong> Cet outil utilise une intelligence artificielle. 
              Les résultats sont fournis à titre indicatif uniquement et ne remplacent en aucun cas un diagnostic médical professionnel. 
              En cas d'urgence, contactez le 15 ou le 112 immédiatement.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
                    <Stethoscope className="w-6 h-6" />
                    <h2 className="text-xl font-bold">Vos Symptômes</h2>
                </div>
                <form onSubmit={handleAnalysis} className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Décrivez vos symptômes
                    </label>
                    <textarea
                        rows={5}
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Ex: Maux de tête intenses, sensibilité à la lumière, nausées..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        required
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Informations complémentaires (âge, antécédents...)
                    </label>
                    <input
                        type="text"
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        placeholder="Ex: Homme 45 ans, diabétique"
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    </div>
                    <button
                    type="submit"
                    disabled={loading || !symptoms.trim()}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                    {loading ? <Loader2 className="animate-spin" /> : 'Analyser avec Medigeni'}
                    </button>
                </form>
            </div>
        </div>

        <div className="md:col-span-3">
          {result ? (
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-8 border border-gray-200 dark:border-slate-700 h-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 dark:border-slate-700">
                Résultat de l'analyse
              </h3>
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 text-gray-400">
              <Stethoscope className="w-12 h-12 mb-4 opacity-50" />
              <p>Décrivez vos symptômes pour obtenir une analyse.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Symptoms;