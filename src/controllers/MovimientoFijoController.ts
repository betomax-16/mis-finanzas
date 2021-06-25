import MovimientoFijo, { IMovimientoFijo } from '../models/Movimientos/MovimientoFijo';
import mongoose from 'mongoose';

class MovimientoFijoController {
    agregarMovimiento(body: IMovimientoFijo) {
        return body.save();
    }

    actualizarMovimiento(id: string, body: IMovimientoFijo) {
        const data = body;
        delete data._id;
        delete data.cuenta;
        return MovimientoFijo.findByIdAndUpdate(id, data, {new: true, useFindAndModify: false});
    }

    obtenerMovimiento(id: string) {
        return MovimientoFijo.findById(id);
    }

    obtenerMovimientos(idCuenta: string) {
        return MovimientoFijo.find({ cuenta: mongoose.Types.ObjectId(idCuenta) });
    }

    eliminarMovimiento(id: string) {
        return MovimientoFijo.findByIdAndDelete(id);
    }
}

export = new MovimientoFijoController();