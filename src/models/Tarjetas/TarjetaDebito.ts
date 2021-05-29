import mongoose, { Schema, Document } from 'mongoose';
import { ITarjeta } from './Tarjeta';

export interface ITarjetaDebito extends Document {
    tarjeta: ITarjeta['_id'];
}

const TarjetaDebitoSchema: Schema = new Schema({
    tarjeta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tarjetas',
        require: true
    }
});

export default mongoose.model<ITarjetaDebito>('TarjetasDebito', TarjetaDebitoSchema);