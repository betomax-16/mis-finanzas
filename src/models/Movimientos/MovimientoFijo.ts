import mongoose, { Document, Schema } from 'mongoose';
import { ICuenta } from '../Cuentas/Cuenta';

export interface IMovimientoFijo extends Document {
    cuenta: ICuenta['_id'];
    monto: number;
    codigoDivisa: string;
    fechaLimitePago: Date;
    motivo: string;
    perioricidad: string;
    agrupamiento: number;
    recurrencia: number;
    cargo: number;
}

const MovimientoFijoSchema: Schema = new Schema({
    cuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuentas',
        require: true
    },
    monto: { type: Number, required: true },
    codigoDivisa: { type: String, required: true },
    fechaLimitePago: { type: Date, required: true, default: Date.now },
    motivo: { type: String, required: true },
    perioricidad: { type: String, required: true },
    agrupamiento: { type: Number, required: true },
    recurrencia: { type: Number, required: true },
    cargo: { type: Number },
});

export default mongoose.model<IMovimientoFijo>('MovimientosFijos', MovimientoFijoSchema);