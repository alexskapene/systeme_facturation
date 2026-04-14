import User from '../models/User';
import { IUser } from '../types/user.types';

// Créer un utilisateur (Par l'Admin)
export const createUser = async (userData: Partial<IUser>) => {
  const userExists = await User.findOne({ email: userData.email });
  if (userExists) throw new Error('Cet email est déjà utilisé.');

  const user = await User.create(userData);
  return await User.findById(user._id); // Pour le renvoyer sans le mot de passe
};

// Récupérer tous les utilisateurs
export const getAllUsers = async () => {
  return await User.find().sort({ createdAt: -1 });
};

// Récupérer un utilisateur par ID
export const getUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new Error('Utilisateur introuvable');
  return user;
};

// Mettre à jour un utilisateur
export const updateUser = async (id: string, updateData: Partial<IUser>) => {
  // Si on essaie de modifier le mot de passe via cette route, on le bloque
  // (il faut une route spéciale pour le mot de passe)
  if (updateData.password) delete updateData.password;

  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new Error('Utilisateur introuvable');
  return user;
};

// Désactiver/Activer un compte (Soft Delete)
export const toggleUserStatus = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new Error('Utilisateur introuvable');

  // Empêcher de désactiver le SUPER_ADMIN
  if (user.role === 'SUPER_ADMIN') {
    throw new Error('Le Super Admin ne peut pas être désactivé.');
  }

  user.actif = !user.actif;
  await user.save();
  return user;
};
