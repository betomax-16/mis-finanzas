import mongoose, { Document, Schema } from 'mongoose';
import { ICuenta } from '../Cuentas/Cuenta';

export interface ITarjeta extends Document {
    alias: string;
    numero: string;
    fechaVencimiento: Date;
    tipo?: string;
    estado: boolean;
    cuenta: ICuenta['_id'];
}

const TarjetaSchema: Schema = new Schema({
    alias: { type: String, required: true },
    numero: { type: String, required: true, unique: true },
    fechaVencimiento: { type: Date, required: true },
    tipo: { type: String, required: true },
    estado: { type: Boolean, required: true, default: true },
    cuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuentas',
        require: true
    },
});

export default mongoose.model<ITarjeta>('Tarjetas', TarjetaSchema);