import Movimiento, { IMovimiento } from '../models/Movimientos/Movimiento';
import mongoose from 'mongoose';

class MovimientoController {
    agregarMovimiento(body: IMovimiento) {
        return body.save();
    }

    actualizarMovimiento(id: string, body: IMovimiento) {
        const data = body.toObject();
        delete data._id;
        delete data.cuenta;
        return Movimiento.findByIdAndUpdate(id, data, {new: true, useFindAndModify: false});
    }

    obtenerMovimiento(id: string) {
        return Movimiento.findById(id);
    }

    obtenerMovimientos(idCuenta: string) {
        return Movimiento.find({ cuenta: mongoose.Types.ObjectId(idCuenta) });
    }

    eliminarMovimiento(id: string) {
        return Movimiento.findByIdAndDelete(id);
    }
}

export = new MovimientoController();