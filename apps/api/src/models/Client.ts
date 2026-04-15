import mongoose, { Schema } from 'mongoose';
import { IClient, ClientType } from '../types/client.types';

const ClientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: [true, 'Le nom ou la raison sociale est requis'],
      trim: true,
    },
    clientType: {
      type: String,
      enum: Object.values(ClientType),
      default: ClientType.PERSONNE_PHYSIQUE,
    },
    nif: {
      type: String,
      unique: true,
      sparse: true, // Autorise plusieurs clients sans NIF (particuliers)
      trim: true,
    },
    rccm: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Le numéro de téléphone est requis'],
    },
    address: {
      type: String,
      required: [true, "L'adresse est requise"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IClient>('Client', ClientSchema);
