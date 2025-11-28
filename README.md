**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

   Voici une documentation technique détaillée expliquant le processus de création, l'architecture et la logique derrière Medigeni. Ce document est conçu pour qu'un développeur puisse comprendre comment l'application a été construite de A à Z.
   Documentation Technique : Projet Medigeni
   Architecture, Logique Métier et Intégration IA

4. Vue d'ensemble du Projet
   Medigeni est une Application Web Progressive (PWA) de santé numérique. Elle combine deux aspects fondamentaux :
   Des outils médicaux assistés par IA (Chatbot, Calculateur IMC, Analyse de symptômes, Suivi menstruel).
   Une plateforme de mise en relation entre patients et médecins (Prise de rendez-vous, Gestion de patientèle).
   L'application est construite en React (TypeScript) avec Tailwind CSS pour le style et Google Gemini pour l'intelligence artificielle.
5. Architecture Technique (La Structure)
   L'application suit une architecture modulaire pour faciliter la maintenance et l'évolution.
   Structure des dossiers :
   components/ : Éléments réutilisables d'interface (Layout, Navbar, Modals, Cartes).
   pages/ : Les vues principales correspondantes aux routes (Home, Dashboard, Outils).
   services/ : Logique métier externe (Appels API Gemini, Simulation de Base de données).
   context/ : Gestion de l'état global de l'application (Authentification, Données médicales, Interface).
   types.ts : Définitions TypeScript pour garantir la cohérence des données.
6. Gestion de l'État Global (Le "Cerveau" de l'App)
   Pour éviter de passer des données de parent à enfant indéfiniment ("prop drilling"), nous utilisons l'API Context de React divisée en trois parties :
   AuthContext (Authentification) :
   Gère l'utilisateur connecté (user).
   Fournit les fonctions login, register, logout.
   Maintient la session active à travers l'application.
   MedicalContext (Données de Santé & Rendez-vous) :
   Agit comme une base de données temps réel côté client.
   Stocke les résultats d'outils (Dernier IMC calculé, Durée du cycle menstruel).
   Gère la liste centralisée des Rendez-vous. C'est ici que la magie opère : quand un patient ajoute un RDV, le contexte se met à jour, et le composant du Médecin (qui écoute ce même contexte) affiche instantanément la demande.
   UIContext (Interface Utilisateur) :
   Contrôle l'état global des Modals (Fenêtres contextuelles).
   Permet d'ouvrir la fenêtre de "Connexion/Inscription" depuis n'importe quel bouton de l'application (ex: depuis la page d'accueil ou le dashboard) sans logique complexe dans les composants pages.
7. Détail des Fonctionnalités Clés
   A. Système d'Authentification Avancé
   Composant AuthModal : Une fenêtre unique qui gère à la fois la connexion et l'inscription.
   Effet "Flip 3D" : Utilisation de CSS transform: rotateY pour basculer visuellement entre le formulaire de connexion et d'inscription.
   Logique d'Inscription : Lorsqu'un utilisateur s'inscrit, il est ajouté dynamiquement au tableau mockUsers dans services/mockData.ts. Cela permet de se déconnecter et de se reconnecter avec les nouveaux identifiants tant que la page n'est pas rafraîchie.
   Redirection par Rôle : Après connexion, le système vérifie le rôle (admin, doctor, patient) et redirige vers le tableau de bord approprié.
   B. Prise de Rendez-vous (Workflow Complexe)
   Ce flux démontre l'interaction entre les contextes :
   Action : L'utilisateur clique sur "Prendre rendez-vous" (Accueil ou Dashboard).
   Vérification : La fonction vérifie isAuthenticated via AuthContext.
   Si NON connecté : Appel de openAuthModal('register') via UIContext. L'utilisateur est forcé de s'inscrire/se connecter.
   Si connecté : Ouverture du modal de réservation local.
   Validation : L'utilisateur saisit le motif.
   Enregistrement : Un objet Appointment est créé avec le statut pending et les coordonnées du patient (Email/Tel), puis envoyé au MedicalContext.
   Réception : Le Dashboard Médecin détecte le nouveau RDV et l'affiche.
   C. Intégration de l'Intelligence Artificielle (Gemini)
   Le fichier services/geminiService.ts centralise tous les appels à l'API Google Gemini.
   Chatbot Médical :
   Maintient un historique de conversation (history).
   Utilise une "Instruction Système" pour forcer l'IA à agir comme un assistant médical empathique mais prudent (disclaimer obligatoire).
   Calculateur IMC Intelligent :
   Calcule mathématiquement l'IMC.
   Envoie les données (Taille, Poids, IMC) à Gemini pour générer une interprétation textuelle et 3 conseils personnalisés.
   Analyseur de Symptômes :
   Agit comme un système de triage.
   Prompt spécifique pour structurer la réponse : Causes potentielles, Niveau d'urgence, Conseils immédiats.
   "Avis Rapide" (Dashboard Médecin) :
   Outil dédié aux médecins pour vérifier rapidement une posologie ou une interaction médicamenteuse via l'IA.
   D. Tableaux de Bord (Dashboards)
   Dashboard Patient :
   Synchronisé avec MedicalContext pour afficher le dernier IMC calculé sur la page "Calculateur" et la durée du cycle définie sur la page "Menstruation".
   Liste des RDV avec codes couleurs pour les statuts.
   Moteur de recherche de médecins (filtrage par nom/spécialité).
   Dashboard Médecin :
   Vue des demandes en attente.
   Accès aux données contact : Dès réception d'une demande, le médecin voit l'email et le téléphone du patient pour le contacter avant d'accepter.
   Actions : Accepter (passe le statut à accepted), Refuser (supprime), Terminer.
   Dashboard Admin :
   Vue globale des statistiques (simulées).
   Gestion CRUD (Créer, Lire, Supprimer) des utilisateurs.
8. Interface & UX (Frontend)
   Responsive Design : Utilisation des classes utilitaires Tailwind (ex: grid-cols-1 md:grid-cols-3) pour adapter la mise en page du mobile au desktop.
   Dark Mode : Implémentation via une classe dark sur la balise HTML et l'utilisation de classes dark:bg-slate-800 dans les composants.
   Feedback Utilisateur : Des états de chargement (Loader2 animate-spin) sont affichés lors des appels IA ou des simulations réseaux pour ne pas laisser l'utilisateur dans l'attente.
   Conclusion
   Ce projet démontre comment créer une application métier complète sans backend réel, en utilisant des services simulés (Mock) et une gestion d'état robuste (Context). Elle est prête à être connectée à une véritable base de données (Firebase, Supabase, SQL) simplement en remplaçant les fonctions dans le dossier services/.
