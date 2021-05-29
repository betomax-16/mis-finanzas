import Prstamo, { IPrestamo } from '../models/Prestamos/Prestamo';
import mongoose from 'mongoose';

class PrstamosController {
    agregarPrestamo(body: IPrestamo) {
        return body.save();
    }

    actualizarPrestamo(id: string, body: IPrestamo) {
        const data = body.toObject();
        delete data._id;
        return Prstamo.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, data, {new: true, useFindAndModify: false});
    }

    obtenerPrestamos(id: string) {
        return Prstamo.find({ cuenta: mongoose.Types.ObjectId(id), estado: false });
    }

    eliminarPrestamo(id: string) {
        return Prstamo.findByIdAndDelete(id);
    }
}

export = new PrstamosController();