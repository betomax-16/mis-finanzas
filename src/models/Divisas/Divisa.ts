import mongoose, { Document, Schema } from 'mongoose';
import { ICuenta } from '../Cuentas/Cuenta';

export interface IDivisa extends Document {
    cuenta: ICuenta['_id'];
    nombre: string;
    codigo: string;
    monto: number;
}

const DivisaSchema: Schema = new Schema({
    cuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuentas',
        require: true
    },
    nombre: { type: String, required: true, default: 'Peso Mexicano' },
    codigo: { type: String, required: true, default: 'MXN' },
    monto: { type: Number, required: true, default: 0 },
});

export default mongoose.model<IDivisa>('Divisas', DivisaSchema);