# Documentation du Projet EntreNousCours

## Chapitre 1 : Contexte du Projet

### 1.1 Introduction

Dans un contexte où l'accès à l'éducation et au soutien scolaire de qualité reste un défi majeur en Tunisie, particulièrement pour les étudiants des régions éloignées ou ceux ayant des contraintes budgétaires, le besoin d'une plateforme de mise en relation entre apprenants et enseignants devient de plus en plus pressant. L'éducation traditionnelle, bien qu'essentielle, ne répond pas toujours aux besoins spécifiques de chaque étudiant, notamment en termes de flexibilité horaire, de personnalisation des contenus et d'accessibilité géographique.

EntreNousCours est née de cette observation : créer un pont numérique entre les étudiants tunisiens qui cherchent de l'aide et ceux qui peuvent en offrir, tout en permettant aux enseignants de partager leurs connaissances et de développer leur communauté d'apprenants. La plateforme s'inscrit dans une démarche d'économie collaborative et d'éducation accessible, en favorisant les échanges de compétences et les cours en ligne ou en présentiel.

Cette solution web moderne permet de démocratiser l'accès au soutien scolaire et aux cours particuliers, en éliminant les barrières géographiques et en réduisant les coûts traditionnellement associés aux cours privés. En combinant technologie moderne, simplicité d'utilisation et approche communautaire, EntreNousCours vise à transformer la façon dont les Tunisiens apprennent et enseignent.

### 1.2 Organisation Hôte : EntreNousCours

EntreNousCours est une initiative éducative numérique dédiée à la création d'une communauté d'apprentissage collaborative en Tunisie. L'organisation se positionne comme un facilitateur de l'éducation accessible, en connectant les différents acteurs du système éducatif tunisien.

#### 1.2.3 Mission

La mission d'EntreNousCours s'articule autour de trois piliers fondamentaux :

1. **Accessibilité** : Rendre l'éducation et le soutien scolaire accessibles à tous les étudiants tunisiens, indépendamment de leur localisation géographique ou de leurs contraintes budgétaires.

2. **Communauté** : Favoriser la création d'une communauté d'apprentissage solidaire où les étudiants peuvent s'entraider et où les enseignants peuvent partager leurs connaissances avec un public plus large.

3. **Innovation** : Utiliser les technologies modernes pour faciliter les échanges éducatifs, en proposant des solutions flexibles (cours en ligne via Google Meet ou en présentiel) adaptées aux besoins de chacun.

La plateforme vise à créer un écosystème éducatif où chaque utilisateur peut à la fois apprendre et enseigner, favorisant ainsi un modèle d'apprentissage mutuel et collaboratif. En permettant aux étudiants de devenir eux-mêmes des enseignants pour les matières qu'ils maîtrisent, EntreNousCours encourage l'autonomie et la responsabilisation dans le processus d'apprentissage.

### 1.3 Analyse et Compréhension de la Problématique

#### Cas d'usage : Le Défi de l'Éducation Accessible en Tunisie

**Contexte du problème :**

Imaginez une étudiante de terminale vivant à Sfax qui prépare son baccalauréat. Elle excelle en mathématiques mais rencontre des difficultés en anglais. Les cours particuliers traditionnels coûtent entre 30 et 50 TND par heure, ce qui représente un budget mensuel de 120 à 200 TND pour seulement 4 heures de cours. Pour une famille aux revenus modestes, cette dépense est souvent inaccessible.

Parallèlement, un étudiant en licence d'informatique à Tunis maîtrise parfaitement l'anglais technique et souhaiterait aider d'autres étudiants, tout en recevant de l'aide en mathématiques avancées. Cependant, il n'a pas de moyen simple de se mettre en relation avec des personnes ayant des besoins complémentaires.

De même, un professeur d'anglais expérimenté souhaite élargir sa clientèle et proposer des sessions en ligne pour toucher des étudiants de toute la Tunisie, mais il manque d'une plateforme simple et professionnelle pour gérer ses cours et ses créneaux.

**Le besoin identifié :**

Ces trois profils illustrent un besoin commun : une plateforme qui permet de :
- Mettre en relation des personnes ayant des compétences complémentaires
- Réduire les coûts d'accès au soutien scolaire
- Faciliter la gestion des cours pour les enseignants
- Offrir une flexibilité géographique et temporelle
- Créer un système d'échange de compétences mutuellement bénéfique

#### 1.3.1 Objectif

L'objectif principal du projet EntreNousCours est de développer une plateforme web moderne et intuitive qui :

1. **Facilite la mise en relation** entre étudiants cherchant de l'aide et ceux pouvant en offrir, ainsi qu'avec des enseignants professionnels.

2. **Réduit les barrières d'accès** à l'éducation en proposant :
   - Des cours gratuits basés sur l'échange de compétences
   - Des cours payants à des tarifs plus accessibles
   - Des options de cours en ligne (via Google Meet) ou en présentiel

3. **Simplifie la gestion** des cours pour les enseignants avec :
   - Un système de gestion des créneaux
   - Un suivi des demandes d'inscription
   - Un profil professionnel complet

4. **Favorise la communauté** en permettant à chaque utilisateur d'être à la fois apprenant et enseignant selon les matières.

5. **Améliore l'expérience utilisateur** grâce à :
   - Une interface moderne et intuitive
   - Un système d'évaluation après chaque session
   - Un chatbot intelligent pour répondre aux questions courantes

#### 1.3.3 Solution Proposée

La solution proposée est une plateforme web développée avec les technologies modernes suivantes :

**Stack technique :**
- **Frontend & Backend** : Next.js 16 avec App Router pour une architecture full-stack unifiée
- **Base de données** : PostgreSQL (Neon) avec Prisma ORM pour une gestion robuste des données
- **Authentification** : NextAuth.js avec intégration Google OAuth pour une connexion sécurisée et simple
- **Interface utilisateur** : React 19 avec Tailwind CSS pour un design moderne et responsive
- **Intelligence artificielle** : Intégration OpenAI pour un chatbot assistant intelligent
- **Hébergement** : Vercel pour un déploiement optimisé et scalable

**Fonctionnalités principales :**

1. **Système d'authentification** : Connexion via Google pour une expérience utilisateur fluide et sécurisée

2. **Gestion des profils** :
   - Profils étudiants avec matières maîtrisées et besoins
   - Profils enseignants avec certifications, vidéos et projets
   - Possibilité d'être à la fois étudiant et enseignant

3. **Publication et découverte de cours** :
   - Création de cours avec images, descriptions détaillées
   - Gestion des créneaux horaires
   - Filtrage par matière, niveau, modalité (en ligne/présentiel)
   - Système de tarification (gratuit, payant, échange)

4. **Gestion des demandes** :
   - Système de demande d'inscription aux cours
   - Acceptation/refus des demandes par les enseignants
   - Suivi des sessions planifiées

5. **Chatbot intelligent** : Assistant virtuel pour répondre aux questions sur le fonctionnement de la plateforme

6. **Système d'évaluation** : Feedback après chaque session pour améliorer la qualité des cours

### 1.4 Méthodologie de Travail

Le développement du projet EntreNousCours a été structuré selon une approche agile utilisant la méthodologie SCRUM, permettant une gestion flexible et itérative du projet.

#### 1.4.1 Structure du Projet en Sprints

Le projet a été divisé en **4 sprints principaux**, chacun se concentrant sur un ensemble cohérent de fonctionnalités :

**Sprint 1 : Authentification et Infrastructure de Base**
- Mise en place de l'architecture Next.js
- Configuration de la base de données PostgreSQL avec Prisma
- Implémentation de l'authentification Google via NextAuth.js
- Création des modèles de données de base (User, Profile)
- Interface de connexion et gestion des sessions

**Sprint 2 : Section Enseignant**
- Création et gestion du profil enseignant
- Publication de cours avec images, descriptions, créneaux
- Gestion des demandes d'inscription aux cours
- Tableau de bord enseignant avec statistiques
- Système de gestion des créneaux horaires
- Upload d'images pour les cours

**Sprint 3 : Section Étudiant**
- Découverte et recherche de cours
- Système de demande d'inscription
- Profil étudiant avec historique des cours suivis
- Gestion des sessions (rejoindre via Google Meet)
- Note importante : Un utilisateur peut être à la fois étudiant et enseignant, permettant une flexibilité totale dans les rôles

**Sprint 4 : Chatbot et Améliorations**
- Intégration d'un chatbot intelligent utilisant l'API OpenAI
- Interface de chat flottante accessible sur toutes les pages
- Réponses contextuelles sur le fonctionnement de la plateforme
- Améliorations UX/UI basées sur les retours utilisateurs
- Optimisations de performance

#### 1.4.2 Implémentation SCRUM

##### Pourquoi SCRUM ?

SCRUM s'est avéré particulièrement adapté à notre projet pour plusieurs raisons essentielles :

- **Accommodation des exigences évolutives** : Le développement itératif permet d'ajuster les fonctionnalités en fonction des retours utilisateurs et des besoins identifiés au fil du développement.

- **Facilitation de la communication** : Les événements SCRUM réguliers (daily stand-ups, sprint reviews) assurent une communication fluide entre les parties prenantes et l'équipe de développement, permettant une compréhension claire des priorités et des défis.

- **Réduction des risques** : La livraison fréquente de logiciels fonctionnels permet d'identifier et de résoudre les problèmes tôt dans le processus, réduisant ainsi les risques de dépassement de budget ou de délai.

- **Validation des décisions de conception** : Les démonstrations régulières permettent de valider les choix de conception et d'interface utilisateur auprès des utilisateurs finaux, garantissant que le produit répond réellement à leurs besoins.

##### Événements SCRUM Clés

**Sprint Planning** : 
- Sélection et planification du travail pour le sprint à venir
- Définition des objectifs du sprint et des critères d'acceptation
- Estimation des tâches et répartition du travail

**Daily Stand-ups** : 
- Réunions de synchronisation quotidiennes de l'équipe
- Partage des progrès, identification des blocages
- Durée limitée à 15 minutes pour maintenir l'efficacité

**Sprint Review** : 
- Démonstration du travail complété aux parties prenantes
- Collecte des retours et ajustements nécessaires
- Validation des fonctionnalités développées

**Sprint Retrospective** : 
- Réflexion sur le processus et identification des améliorations
- Discussion sur ce qui a bien fonctionné et ce qui peut être amélioré
- Planification des ajustements pour les sprints suivants

##### Rôles SCRUM

**Product Owner** : 
- Priorise le travail et représente les intérêts métier
- Définit les user stories et les critères d'acceptation
- Valide les fonctionnalités développées

**Scrum Master** : 
- Facilite le processus SCRUM et supprime les obstacles
- Assure le respect des pratiques SCRUM
- Aide l'équipe à s'améliorer continuellement

**Équipe de Développement** : 
- Groupe auto-organisé qui livre les incréments du produit
- Responsable de l'estimation, de la planification et de la réalisation des tâches
- Collabore pour atteindre les objectifs du sprint

### 1.5 Conclusion

Le projet EntreNousCours représente une réponse innovante aux défis de l'éducation accessible en Tunisie. En combinant une approche communautaire, des technologies modernes et une méthodologie de développement agile, la plateforme vise à créer un écosystème éducatif où l'apprentissage et l'enseignement deviennent accessibles, flexibles et mutuellement bénéfiques.

L'utilisation de la méthodologie SCRUM a permis de structurer le développement en sprints cohérents, facilitant la gestion des priorités, la communication avec les parties prenantes et l'adaptation aux besoins évolutifs du projet. Cette approche itérative garantit que chaque fonctionnalité est développée, testée et validée avant de passer à la suivante, réduisant ainsi les risques et améliorant la qualité globale du produit.

Le résultat final est une plateforme web moderne, intuitive et performante qui répond aux besoins identifiés : faciliter la mise en relation entre apprenants et enseignants, réduire les barrières d'accès à l'éducation, et créer une communauté d'apprentissage collaborative au service de l'éducation tunisienne.

