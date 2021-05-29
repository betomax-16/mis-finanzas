import Gasto, { IGasto } from '../models/Movimientos/Programados/Gasto';
import mongoose from 'mongoose';

class GastosController {
    agregarGasto(body: IGasto) {
        return body.save();
    }

    actualizarGasto(id: string, body: IGasto) {
        const data = body.toObject();
        delete data._id;
        return Gasto.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, data, {new: true, useFindAndModify: false});
    }

    obtenerGastos(id: string) {
        return Gasto.find({ cuenta: mongoose.Types.ObjectId(id), estado: false });
    }

    eliminarGasto(id: string) {
        return Gasto.findByIdAndDelete(id);
    }
}

export = new GastosController();