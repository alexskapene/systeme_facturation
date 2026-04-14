import User from '../models/User';
import { generateToken } from '../utils/jwt';

export const loginUser = async (email: string, password: string) => {
  // Chercher l'utilisateur avec son mot de passe
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Email ou mot de passe incorrect');
  }

  // Vérifier si le compte est actif
  if (!user.actif) {
    throw new Error(
      "Ce compte a été désactivé. Veuillez contacter l'administrateur.",
    );
  }

  // Vérifier le mot de passe
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Email ou mot de passe incorrect');
  }

  // Générer le token
  const token = generateToken(user._id.toString(), user.role);

  // Renvoyer l'utilisateur (sans le mot de passe) et le token
  const userWithoutPassword = await User.findById(user._id);

  return { user: userWithoutPassword, token };
};
