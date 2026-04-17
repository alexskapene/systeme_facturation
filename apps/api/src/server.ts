import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';
import { seedSuperAdmin } from './utils/seeder';

// Config & Erreurs critiques
dotenv.config();

process.on('uncaughtException', (err: unknown) => {
  console.error('❌ UNCAUGHT EXCEPTION! Arrêt...');
  console.error((err as Error).name, (err as Error).message);
  process.exit(1);
});

// Connexion BDD et Lancement
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    await seedSuperAdmin();

    const server = app.listen(PORT, () => {
      console.log(
        `🚀 Serveur eTax démarré [Port ${PORT}] en mode ${process.env.NODE_ENV}`,
      );
    });

    // Gestion des rejets de promesses (ex: perte BDD après démarrage)
    process.on('unhandledRejection', (error: unknown) => {
      console.error('❌ UNHANDLED REJECTION! Fermeture...');
      console.error((error as Error).name, (error as Error).message);
      server.close(() => process.exit(1));
    });

    // Arrêt gracieux
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM reçu. Fermeture propre...');
      server.close(() => process.exit(0));
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();
