import Divisa, { IDivisa } from '../models/Divisas/Divisa';
import mongoose from 'mongoose';

class CuentasController {
    agregarDivisa(body: IDivisa) {
        return body.save();
    }

    actualizarDivisa(id: string, body: IDivisa) {
        const data = body.toObject();
        delete data._id;
        delete data.cuenta;
        return Divisa.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, data, {new: true, useFindAndModify: false});
    }

    obtenerDivisas(id: string) {
        return Divisa.find({ cuenta: mongoose.Types.ObjectId(id) });
    }

    eliminarDivisa(id: string) {
        return Divisa.findByIdAndDelete(id);
    }
}

export = new CuentasController();