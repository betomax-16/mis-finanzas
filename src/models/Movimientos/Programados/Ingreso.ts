import mongoose, { Document, Schema } from 'mongoose';
import { ICuenta } from '../../Cuentas/Cuenta';

export interface IIngreso extends Document {
    cuenta: ICuenta['_id'];
    monto: number;
    codigoDivisa: string;
    motivo: string;
    fecha: Date;
    estado: boolean;
}

const IngresoSchema: Schema = new Schema({
    cuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuentas',
        require: true
    },
    monto: { type: Number, required: true },
    codigoDivisa: { type: String, required: true },
    motivo: { type: String, required: true },
    fecha: { type: Date, required: true, default: Date.now },
    estado: { type: Boolean, required: true, default: false }
});

export default mongoose.model<IIngreso>('Ingreso', IngresoSchema);