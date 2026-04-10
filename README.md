# Système de Facturation Électronique

##  Description du projet

Ce projet consiste à concevoir et développer une application web de **facturation électronique conforme aux normes fiscales de la République Démocratique du Congo (RDC)**.

L'objectif est de moderniser la gestion des factures en automatisant les प्रक्रus, en réduisant les erreurs humaines et en garantissant la conformité fiscale.

---

##  Objectifs

### Objectif général
Mettre en place une solution de facturation électronique :
- sécurisée
- automatisée
- conforme aux normes fiscales de la RDC

### Objectifs spécifiques
- Automatiser le processus de facturation
- Gérer efficacement la TVA
- Assurer un archivage sécurisé
- Réduire les erreurs de saisie
- Centraliser les données
- Supprimer les tâches manuelles (zéro papier)

---

##  Fonctionnalités principales

###  Gestion des factures
- Création de factures électroniques
- Génération automatique des numéros
- Calcul automatique de la TVA (16%)
- Export en PDF
- Historique des factures

###  Gestion des clients
- Ajout / modification / suppression
- Historique des transactions

###  Gestion des produits/services
- Catalogue des produits
- Gestion des prix et taxes

###  Gestion fiscale
- Calcul automatique de la TVA
- Génération de rapports fiscaux
- Conformité aux normes de la RDC

###  Archivage
- Stockage sécurisé
- Sauvegarde automatique
- Accès rapide

###  Tableau de bord
- Statistiques en temps réel
- Chiffre d’affaires
- TVA collectée
- Suivi des factures

---

##  Utilisateurs du système

###  Administrateur
- Gestion des utilisateurs et rôles
- Paramétrage global
- Accès complet

###  Comptable
- Gestion des factures
- Suivi des paiements
- Gestion TVA
- Rapports financiers

###  Gestionnaire
- Analyse des performances
- Prise de décision

###  Agent de vente
- Création rapide de factures
- Gestion clients
- Suivi des ventes

---

##  Architecture du projet

Le projet est structuré comme suit :


### 🔹 Backend (API)
- Node.js
- Gestion des données
- Authentification (JWT)
- Logique métier (factures, TVA, rapports)

### 🔹 Frontend
- React
- Interface utilisateur
- Tableau de bord
- Gestion des factures

---

##  Technologies utilisées

- Frontend : React
- Backend : Node.js
- Base de données : MongoDB

---

##  Sécurité

- Authentification via JWT
- Chiffrement des données
- Sauvegardes régulières
- Traçabilité des actions

---

##  Gestion de la TVA (RDC)

Le système doit appliquer :

- Taux standard : **16%**
- Calcul automatique :
  - TTC = HT + TVA
  - TVA = HT × 16%
  - HT = TTC / 1.16

Exemple :
- HT = 100 000 CDF
- TVA = 16 000 CDF
- TTC = 116 000 CDF

---

##  Rapports financiers

Le système doit générer des rapports contenant :

- Informations de l’entreprise
- Chiffre d’affaires
- TVA collectée
- TVA déductible
- TVA à payer
- Liste des factures
- Journal des opérations
- Indicateurs clés

Format : **PDF**

---

##  Contraintes

- Respect strict des lois fiscales de la RDC
- Archivage légal obligatoire
- Traçabilité complète
- Distinction claire HT / TTC

---

##  Livrables attendus

- Application fonctionnelle
- Documentation technique
- Guide utilisateur
- Rapport final

---

##  Méthodologie

- Méthode agile (Scrum)

---

##  Organisation de l’équipe

- Team Lead : supervision du projet
- Reviewer : validation du code
- Développeurs : implémentation des fonctionnalités

---

##  Lancement du projet

Chaque partie du projet possède son propre README :

- 📁 `/app/api` → Documentation backend
- 📁 `/app/frontend` → Documentation frontend

---

##  Remarque

Ce projet vise à répondre aux exigences de la Direction Générale des Impôts (DGI) en RDC en matière de facturation électronique.

##  Convention de nommage des branches

Pour garantir une bonne organisation du projet, toutes les branches doivent respecter la structure suivante :

###  Format général
type/zone/feature-name


---

##  Types de branches

| Type       | Description |
|------------|------------|
| feature    | Nouvelle fonctionnalité |
| fix        | Correction de bug |
| chore      | Tâches techniques (config, setup) |
| docs       | Documentation |
| refactor   | Amélioration du code sans changer le comportement |

---

##  Zones du projet

| Zone       | Description |
|------------|------------|
| backend    | Partie API (Node.js) |
| frontend   | Interface utilisateur (React) |

---

##  Exemples concrets

### 🔹 Backend
feature/backend/create-invoice
feature/backend/tva-calculation
fix/backend/auth-jwt
chore/backend/setup-server


### 🔹 Frontend

feature/frontend/invoice-ui
feature/frontend/dashboard
fix/frontend/login-form
refactor/frontend/components


##  Règles importantes

###  Structure des branches

- `main` → production (code stable uniquement)
- `develop` → branche principale de développement
- `feature/*` → nouvelles fonctionnalités
- `fix/*` → corrections de bugs

---

###  Workflow de travail

1. Chaque développeur crée sa branche à partir de `develop` :
git checkout develop
git pull origin develop
git checkout -b feature/frontend/dashboard

2. Il travaille et push :
git push origin feature/frontend/dashboard

3. Il crée une Pull Request vers `develop`

4. Le reviewer valide et merge dans `develop`

---

###  Mise en production

Quand le projet est stable :

- Créer une Pull Request de `develop` → `main`
- Validation par le team lead
- Merge vers `main`

---

###  Règles strictes

- ❌ Interdiction de travailler directement sur `main`
- ❌ Interdiction de push directement sur `develop`
- ✅ Passage obligatoire par Pull Request
- ✅ Une branche = une fonctionnalité
- ✅ Respect du nommage des branches