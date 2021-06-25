import mongoose, { Schema, Document } from 'mongoose';
import { ICuenta } from './Cuenta';

export interface ICuentaBancaria extends Document {
    // nombre: string;
    // monto: number;
    noCuenta: string;
    banco: string;
    cuenta: ICuenta['_id'];
}

const AcountSchema: Schema = new Schema({
    // nombre: { type: String, required: true },
    // monto: { type: Number, required: true },
    noCuenta: { type: String, required: true },
    banco: { type: String, required: true },
    cuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuentas',
        require: true
    }
});

export default mongoose.model<ICuentaBancaria>('CuentasBancarias', AcountSchema);