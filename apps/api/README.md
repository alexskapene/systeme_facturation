````markdown
# eTax Solution RDC - Backend API

## 📌 Contexte du Projet

**eTax solution RDC** est un système de facturation électronique sécurisé, automatisé et conforme aux normes fiscales de la République Démocratique du Congo (DGI).

Le système est conçu pour :

- Automatiser la facturation aux normes de la DGI.
- Gérer la TVA (16%) de manière rigoureuse.
- Assurer une traçabilité totale des opérations financières.

---

## 🚀 Fonctionnalités Implémentées (Phase 1)

- **Authentification Robuste :** Basée sur JWT (JSON Web Tokens) et hachage Bcrypt.
- **Gestion des Rôles (RBAC) :** 5 niveaux d'accès (SUPER_ADMIN, ADMIN, COMPTABLE, GESTIONNAIRE, AGENT_VENTE).
- **Architecture Propre :** Séparation stricte entre la configuration de l'application (`app.ts`) et le démarrage du serveur (`server.ts`).
- **Seeder Automatique :** Création d'un Super Admin par défaut au premier lancement pour sécuriser l'accès initial.
- **Documentation API :** Swagger UI intégré pour faciliter l'intégration avec le Frontend.

---

## 🛠️ Stack Technique

- **Runtime :** Node.js v20+
- **Framework :** Express 5.0 (Gestion native des erreurs asynchrones)
- **Langage :** TypeScript (Typage strict pour la sécurité financière)
- **Base de données :** MongoDB Atlas via Mongoose
- **Documentation :** Swagger / OpenAPI 3.0

---

## 📂 Architecture du Projet

```text
src/
├── config/          # Connexion DB, Configuration Swagger, Variables globales
├── controllers/     # Orchestration des requêtes/réponses (Appel des services)
├── middleware/      # Protecteurs (Auth JWT), Autorisations (Rôles), Error Handler
├── models/          # Schémas Mongoose (Définition des données)
├── routes/          # Endpoints de l'API (Centralisés dans index.ts)
├── services/        # Logique métier pure (Seul endroit où on touche à la DB)
├── types/           # Interfaces et Enums TypeScript
├── utils/           # Helpers (Génération JWT, Seeder, Calculs fiscaux)
├── app.ts           # Configuration de l'objet Express (Middlewares & Routes)
└── server.ts        # Point d'entrée (Bootstrap, DB connection, Error handling)
```
````

---

## 🔐 Sécurité & Rôles

Le système est une **application interne**. L'inscription publique est désactivée.

- **SUPER_ADMIN / ADMIN :** Seuls autorisés à créer, modifier ou désactiver des utilisateurs.
- **Authentification :** Header `Authorization: Bearer <token>`.
- **Soft Delete :** On ne supprime pas d'utilisateurs, on les désactive via `toggle-status` pour préserver l'historique des factures.

---

## ⚙️ Installation et Lancement

1. **Cloner le projet**
2. **Installer les dépendances :**
   ```bash
   npm install
   ```
3. **Configurer le `.env` :**
   Copier `.env.example` vers `.env` et remplir les variables (MONGO_URI, JWT_SECRET).
4. **Lancer en mode développement :**
   ```bash
   npm run dev
   ```
   _Le serveur créera automatiquement un compte par défaut : `admin@etax.cd` / `Password123!`_

---

## 📖 Documentation de l'API

Une fois le serveur lancé, la documentation interactive (Swagger) est disponible ici :
👉 `http://localhost:5001/api/v1/docs`

---

## 🚦 Conventions de développement

- **Langue :** Code en anglais (variables, fonctions), messages d'erreurs client en français.
- **Service Layer :** Toujours passer par un service pour interagir avec un modèle Mongoose.
- **Typage :** Éviter le type `any`. Toujours définir une interface dans `src/types`.

```

```
