import mongoose, { Document, Schema } from 'mongoose';
import { ITarjeta } from '../Tarjetas/Tarjeta';

export interface IMovimientoCrediticio extends Document {
    tarjeta: ITarjeta['_id'];
    monto: number;
    codigoDivisa: string;
    fecha: Date;
    motivo: string;
}

const MovimientoCrediticioSchema: Schema = new Schema({
    tarjeta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tarjetas',
        require: true
    },
    monto: { type: Number, required: true },
    codigoDivisa: { type: String, required: true },
    fecha: { type: Date, required: true, default: Date.now },
    motivo: { type: String, required: true },
});

export default mongoose.model<IMovimientoCrediticio>('MovimientosCrediticios', MovimientoCrediticioSchema);