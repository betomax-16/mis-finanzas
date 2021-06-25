import Tarjeta, { ITarjeta } from '../models/Tarjetas/Tarjeta';
import TarjetaCredito, { ITarjetaCredito } from '../models/Tarjetas/TarjetaCredito';
import TarjetaDebito, { ITarjetaDebito } from '../models/Tarjetas/TarjetaDebito';
import mongoose from 'mongoose';

class TarjetasController {
    agregarTarjeta(body: ITarjeta) {
        return body.save();
    }

    agregarTarjetaCreditoODebito(body: ITarjetaCredito|ITarjetaDebito) {
        return body.save();
    }

    actualizarTarjeta(id: string, body: ITarjeta) {
        const data = body.toObject();
        delete data._id;
        delete data.tipo;
        delete data.cuenta;
        return Tarjeta.findByIdAndUpdate(id, data, {new: true, useFindAndModify: false});
    }

    actualizarTarjetaCreditoODebito(id: string, body: ITarjetaCredito|ITarjetaDebito) {
        const data = body.toObject();
        delete data._id;
        delete data.tarjeta;
        if (body instanceof TarjetaCredito) {
            return TarjetaCredito.findOneAndUpdate({ tarjeta: mongoose.Types.ObjectId(id) }, data, {new: true, useFindAndModify: false});
        }
        else if (body instanceof TarjetaDebito) 
        {
            return TarjetaDebito.findOneAndUpdate({ tarjeta: mongoose.Types.ObjectId(id) }, data, {new: true, useFindAndModify: false});
        }
    }

    obtenerTarjeta(id: string) {
        // const month: number = new Date().getMonth() + 1;
        // const year: number = new Date().getFullYear() % 1000;

        return Tarjeta.aggregate([
            {   
                $match : { 
                            "_id" : mongoose.Types.ObjectId(id),
                            "fechaVencimiento": { $gte: new Date() }, 
                            "estado": true
                         }    
            },
            {
                $lookup:
                {
                    from: "tarjetasdebitos",
                    localField: "_id",
                    foreignField: "tarjeta",
                    as: "extra"
                }
            },
            { $unwind: { path: "$extra", preserveNullAndEmptyArrays: true } },
            {
                $lookup:
                {
                    from: "tarjetascreditos",
                    localField: "_id",
                    foreignField: "tarjeta",
                    as: "extra2"
                }
            },
            { $unwind: { path: "$extra2", preserveNullAndEmptyArrays: true } },
            { $project:
                {
                    "cuenta": "$cuenta",
                    "alias": "$alias",
                    "numero": "$numero",
                    "fechaVencimiento": { $dateToString: {format: "%m-%Y", date: "$fechaVencimiento"} },
                    "tipo": "$tipo",
                    "montoLimite": "$extra2.montoLimite",
                    "montoDisponible": "$extra2.montoDisponible",
                    "codigo": "$extra2.codigo",
                    "peridoDeCorte": "$extra2.peridoDeCorte",
                    "diasExtraDeCorte": "$extra2.diasExtraDeCorte",
                    "interes": "$extra2.interes",
                    "fechaAperturaMensual": { $dateToString: {format: "%Y-%m-%d", date: "$extra2.fechaAperturaMensual"} },
                    "estado": "$estado",
                }
            }
        ])
    }

    obtenerTarjetas(idCuenta: string) {
        // const month: number = new Date().getMonth() + 1;
        // const year: number = new Date().getFullYear() % 1000;;

        return Tarjeta.aggregate([
            {   
                $match : { 
                            "cuenta" : mongoose.Types.ObjectId(idCuenta),
                            "fechaVencimiento": { $gte: new Date() }, 
                            "estado": true
                         }    
            },
            {
                $lookup:
                {
                    from: "tarjetasdebitos",
                    localField: "_id",
                    foreignField: "tarjeta",
                    as: "extra"
                }
            },
            { $unwind: { path: "$extra", preserveNullAndEmptyArrays: true } },
            {
                $lookup:
                {
                    from: "tarjetascreditos",
                    localField: "_id",
                    foreignField: "tarjeta",
                    as: "extra2"
                }
            },
            { $unwind: { path: "$extra2", preserveNullAndEmptyArrays: true } },
            { $project:
                {
                    "cuenta": "$cuenta",
                    "alias": "$alias",
                    "numero": "$numero",
                    "fechaVencimiento": { $dateToString: {format: "%m-%Y", date: "$fechaVencimiento"} },
                    "tipo": "$tipo",
                    "montoLimite": "$extra2.montoLimite",
                    "montoDisponible": "$extra2.montoDisponible",
                    "codigo": "$extra2.codigo",
                    "peridoDeCorte": "$extra2.peridoDeCorte",
                    "diasExtraDeCorte": "$extra2.diasExtraDeCorte",
                    "interes": "$extra2.interes",
                    "fechaAperturaMensual": { $dateToString: {format: "%Y-%m-%d", date: "$extra2.fechaAperturaMensual"} },
                    "estado": "$estado",
                }
            }
        ])
    }

    eliminarTarjeta(id: string) {
        return Tarjeta.findByIdAndDelete(id);
    }

    eliminarTarjetaDebito(id: string) {
        return TarjetaDebito.findOneAndDelete({ tarjeta: mongoose.Types.ObjectId(id) });
    }

    eliminarTarjetaCredito(id: string) {
        return TarjetaCredito.findOneAndDelete({ tarjeta: mongoose.Types.ObjectId(id) });
    }
}

export = new TarjetasController();