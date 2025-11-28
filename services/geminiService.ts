import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// NOTE: Ensure process.env.API_KEY is available in your environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-2.5-flash"; // Efficient for text tasks

export const geminiService = {
  /**
   * General Chatbot interaction
   */
  async chat(message: string, history: { role: string; parts: { text: string }[] }[] = []): Promise<string> {
    try {
      const chat = ai.chats.create({
        model: modelId,
        config: {
          systemInstruction: "Tu es Medigeni, un assistant médical virtuel utile, empathique et professionnel. Tu fournis des informations de santé générales, mais tu dois TOUJOURS rappeler à l'utilisateur que tu es une IA et qu'il doit consulter un médecin pour un vrai diagnostic. Tes réponses sont concises, claires et rassurantes.",
        },
        history: history
      });

      const result = await chat.sendMessage({ message });
      return result.text || "Désolé, je n'ai pas pu générer de réponse.";
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      throw new Error("Impossible de communiquer avec Medigeni pour le moment.");
    }
  },

  /**
   * Analyzes BMI and provides health advice
   */
  async analyzeBMI(bmi: number, height: number, weight: number): Promise<string> {
    try {
      const prompt = `
        Un patient a un IMC de ${bmi.toFixed(1)} (Taille: ${height}cm, Poids: ${weight}kg).
        Interprète cet IMC (maigreur, normal, surpoids, obésité, etc.) et donne 3 conseils de santé courts et actionnables pour cette personne.
        Reste bienveillant et factuel.
      `;

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
      });

      return response.text || "Analyse non disponible.";
    } catch (error) {
      console.error("Gemini BMI Error:", error);
      return "Une erreur est survenue lors de l'analyse de votre IMC.";
    }
  },

  /**
   * Analyzes symptoms provided by the user
   */
  async analyzeSymptoms(symptoms: string, additionalInfo?: string): Promise<string> {
    try {
      const prompt = `
        Agis comme un système de triage médical préliminaire.
        Symptômes décrits par l'utilisateur : "${symptoms}".
        Info complémentaire : "${additionalInfo || 'Aucune'}".
        
        Tâche :
        1. Résume les causes potentielles courantes (liste à puces).
        2. Indique le niveau d'urgence apparent (Faible, Modéré, Élevé - Consultez immédiatement).
        3. Donne des conseils de premiers soins ou d'hygiène de vie simples.
        
        IMPÉRATIF : Commence par une clause de non-responsabilité indiquant que ceci n'est pas un diagnostic médical et qu'il faut consulter un professionnel.
      `;

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
      });

      return response.text || "Analyse des symptômes indisponible.";
    } catch (error) {
      console.error("Gemini Symptoms Error:", error);
      return "Désolé, je ne peux pas analyser ces symptômes pour le moment.";
    }
  }
};