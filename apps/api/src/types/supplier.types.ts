import { Document, Types } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  nif?: string; // Numéro d'Identification Fiscale (Crucial en RDC)
  rccm?: string; // Registre du Commerce
  address?: string;
  phone: string;
  email?: string;
  createdBy: Types.ObjectId;
}
