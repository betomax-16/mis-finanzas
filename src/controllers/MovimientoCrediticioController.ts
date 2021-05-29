import MovimientoCrediticio, { IMovimientoCrediticio } from '../models/Movimientos/MovimientoCrediticio';
import mongoose from 'mongoose';

class MovimientoCrediticioController {
    agregarMovimientoCrediticio(body: IMovimientoCrediticio) {
        return body.save();
    }

    actualizarMovimientoCrediticio(id: string, body: IMovimientoCrediticio) {
        const data = body.toObject();
        delete data._id;
        delete data.tarjeta;
        return MovimientoCrediticio.findByIdAndUpdate(id, data, {new: true, useFindAndModify: false});
    }

    obtenerMovimientoCrediticio(id: string) {
        return MovimientoCrediticio.findById(id);
    }

    obtenerMovimientosCrediticios(idTarjeta: string) {
        return MovimientoCrediticio.find({ tarjeta: mongoose.Types.ObjectId(idTarjeta) });
    }

    eliminarMovimientoCrediticio(id: string) {
        return MovimientoCrediticio.findByIdAndDelete(id);
    }
}

export = new MovimientoCrediticioController();