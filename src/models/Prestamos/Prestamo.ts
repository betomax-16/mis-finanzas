import mongoose, { Document, Schema } from 'mongoose';
import { ICuenta } from '../Cuentas/Cuenta';

export interface IPrestamo extends Document {
    cuenta: ICuenta['_id'];
    monto: number;
    codigoDivisa: string;
    fechaInicio: Date;
    fechaFinal: Date;
    interes: number;
    estado: boolean;
}

const PrestamoSchema: Schema = new Schema({
    cuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuentas',
        require: true
    },
    monto: { type: Number, required: true },
    codigoDivisa: { type: String, required: true },
    fechaInicio: { type: Date, required: true, default: Date.now },
    fechaFinal: { type: Date, required: true, default: Date.now },
    interes: { type: Number, required: true },
    estado: { type: Boolean, required: true, default: false }
});

export default mongoose.model<IPrestamo>('Prestamo', PrestamoSchema);