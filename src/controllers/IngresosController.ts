import Ingreso, { IIngreso } from '../models/Movimientos/Programados/Ingreso';
import mongoose from 'mongoose';

class IngresosController {
    agregarIngreso(body: IIngreso) {
        return body.save();
    }

    actualizarIngreso(id: string, body: IIngreso) {
        const data = body.toObject();
        delete data._id;
        return Ingreso.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, data, {new: true, useFindAndModify: false});
    }

    obtenerIngresos(id: string) {
        return Ingreso.find({ cuenta: mongoose.Types.ObjectId(id), estado: false });
    }

    eliminarIngreso(id: string) {
        return Ingreso.findByIdAndDelete(id);
    }
}

export = new IngresosController();