import mongoose, { Document, Schema } from 'mongoose';
import { ICuenta } from '../../Cuentas/Cuenta';
import { ITarjetaCredito } from '../../Tarjetas/TarjetaCredito';

export interface IGasto extends Document {
    cuenta: ICuenta['_id'];
    monto: number;
    codigoDivisa: string;
    motivo: string;
    fecha: Date;
    estado: boolean;
    tarjeta: ITarjetaCredito['_id'];
}

const GastoSchema: Schema = new Schema({
    cuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuentas',
        require: true
    },
    monto: { type: Number, required: true },
    codigoDivisa: { type: String, required: true },
    motivo: { type: String, required: true },
    fecha: { type: Date, required: true, default: Date.now },
    estado: { type: Boolean, required: true, default: false },
    tarjeta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tarjetascreditos',
        require: false
    },
});

export default mongoose.model<IGasto>('Gastos', GastoSchema);