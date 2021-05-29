import mongoose, { Schema, Document } from 'mongoose';
import { ICuenta } from './Cuenta';

export interface ICuentaPersonal extends Document {
    // nombre: string;
    // monto: number;
    cuenta: ICuenta['_id'];
}

const AcountSchema: Schema = new Schema({
    cuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuentas',
        require: true
    }
});

export default mongoose.model<ICuentaPersonal>('CuentasPersonales', AcountSchema);