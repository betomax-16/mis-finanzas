import mongoose, { Document, Schema } from 'mongoose';
import { ICuenta } from '../Cuentas/Cuenta';

export interface IMovimiento extends Document {
    cuenta: ICuenta['_id'];
    monto: number;
    codigoDivisa: string;
    fecha: Date;
    motivo: string;
}

const MovimientoSchema: Schema = new Schema({
    cuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuentas',
        require: true
    },
    monto: { type: Number, required: true },
    codigoDivisa: { type: String, required: true },
    fecha: { type: Date, required: true, default: Date.now },
    motivo: { type: String, required: true },
});

export default mongoose.model<IMovimiento>('Movimientos', MovimientoSchema);