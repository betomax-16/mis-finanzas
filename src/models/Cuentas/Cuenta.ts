import mongoose, { Document, Schema } from 'mongoose';

export interface ICuenta extends Document {
    nombre: string;
    estado: boolean;
    tipo?: string;
}

const CuentaSchema: Schema = new Schema({
    nombre: { type: String, required: true },
    estado: { type: Boolean, required: true },
    tipo: { type: String, required: true },
});

export default mongoose.model<ICuenta>('Cuentas', CuentaSchema);