import express, { Application, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connetDB from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import { seedSuperAdmin } from './utils/seeder';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// ==============================================================================
// GESTION DES EXCEPTIONS NON CAPTURÉES (Doit être tout en haut du fichier)
// ==============================================================================
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Arrêt du serveur...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données MongoDB
connetDB().then(() => {
  seedSuperAdmin(); // Créer le SUPER_ADMIN par défaut si aucun utilisateur n'existe
});

// Initialiser Express
const app: Application = express();

// ==============================================================================
// MIDDLEWARES GLOBAUX
// ==============================================================================
app.use(cors()); // Pour permettre les requêtes cross-origin
app.use(express.json()); // Pour parser les requêtes JSON
app.use(express.urlencoded({ extended: true })); // Pour parser les requêtes URL-encoded

// ==============================================================================
// ROUTES
// ==============================================================================
// Route de test pour vérifier que le serveur fonctionne
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Bienvenue sur l'API eTax Solution RDC - Serveur opérationnel 🚀",
    timestamp: new Date().toISOString(),
  });
});
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Documentation Swagger
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// ==============================================================================
// GESTION DES ROUTES INCONNUES (Erreur 404)
// ==============================================================================
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  const error = new Error(
    `La route ${req.originalUrl} n'existe pas sur ce serveur.`,
  );
  next(error);
});

// ==============================================================================
// MIDDLEWARE GLOBAL DE GESTION DES ERREURS
// ==============================================================================
app.use(errorHandler);

// ==============================================================================
// LANCEMENT DU SERVEUR
// ==============================================================================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `🚀 Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV}`,
  );
});

// ==============================================================================
// GESTION DES REJETS DE PROMESSES NON GÉRÉS (ex: perte de connexion BDD)
// ==============================================================================
process.on('unhandleRejection', (err: unknown) => {
  console.error('❌ UNHANDLED REJECTION! Arrêt du serveur...');
  console.error((err as Error).name, (err as Error).message);
  server.close(() => {
    process.exit(1);
  });
});

// ==============================================================================
// ARRÊT GRACIEUX (Graceful Shutdown)
// ==============================================================================
process.on('SIGTERM', () => {
  console.log('👋 Signal SIGTERM reçu. Fermeture gracieuse du serveur...');
  server.close(() => {
    console.log('✅ Serveur fermé. Arrêt du processus.');
    process.exit(0);
  });
});
