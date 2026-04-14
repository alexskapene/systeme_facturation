import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes/index';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utilisation du Router central (Préfixe global)
app.use('/api/v1', apiRoutes);

// Gestion des routes inconnues (404)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  next(new Error(`La route ${req.originalUrl} n'existe pas.`));
});

// Middleware global de gestion des erreurs
app.use(errorHandler);

export default app;
