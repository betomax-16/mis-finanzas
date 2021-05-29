import mongoose, { Schema, Document, Date } from 'mongoose';
import { ITarjeta } from './Tarjeta';

export interface ITarjetaCredito extends Document {
    tarjeta: ITarjeta['_id'];
    montoLimite: number;
    montoDisponible: number;
    codigo: string;
    peridoDeCorte: number;
    diasExtraDeCorte: number;
    interes: number;
    fechaAperturaMensual: Date;
}

const TarjetaCreditoSchema: Schema = new Schema({
    tarjeta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tarjetas',
        require: true
    },
    montoLimite: { type: Number, required: true },
    montoDisponible: { type: Number, required: true },
    codigo: { type: String, required: true, default: 'MXN' },
    peridoDeCorte: { type: Number, required: true },
    diasExtraDeCorte: { type: Number, required: true },
    interes: { type: Number, required: true },
    fechaAperturaMensual: { type: Date, required: true, default: Date.now },
});

export default mongoose.model<ITarjetaCredito>('TarjetasCredito', TarjetaCreditoSchema);