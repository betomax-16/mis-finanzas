import Cuenta, { ICuenta } from '../models/Cuentas/Cuenta';
import CuentaBancaria, { ICuentaBancaria } from '../models/Cuentas/CuentaBancaria';
import CuentaPersonal, { ICuentaPersonal } from '../models/Cuentas/CuentaPersonal';
import mongoose from 'mongoose';

class CuentasController {
    agregarCuenta(body: ICuenta) {
        return body.save();
    }

    agregarCuentaBancariaOPersonal(body: ICuentaBancaria|ICuentaPersonal) {
        return body.save();
    }

    actualizarCuenta(id: string, body: ICuenta) {
        const data = body.toObject();
        delete data._id;
        delete data.tipo;
        return Cuenta.findByIdAndUpdate(id, data, {new: true, useFindAndModify: false});
    }

    actualizarCuentaBancariaOPersonal(id: string, body: ICuentaBancaria|ICuentaPersonal) {
        const data = body.toObject();
        delete data._id;
        delete data.cuenta;
        if (body instanceof CuentaBancaria) {
            return CuentaBancaria.findOneAndUpdate({ cuenta: mongoose.Types.ObjectId(id) }, data, {new: true, useFindAndModify: false});
        }
        else if (body instanceof CuentaPersonal) 
        {
            return CuentaPersonal.findOneAndUpdate({ cuenta: mongoose.Types.ObjectId(id) }, data, {new: true, useFindAndModify: false});
        }
    }

    activarCuenta(id: string) {
        return Cuenta.findByIdAndUpdate(id, {estado: true}, {new: true, useFindAndModify: false});
    }

    obtenerCuenta(id: string) {
        return Cuenta.aggregate([
            {   
                $match : { "_id" : mongoose.Types.ObjectId(id), "estado": true }    
            },
            {
                $lookup:
                {
                    from: "divisas",
                    localField: "_id",
                    foreignField: "cuenta",
                    as: "divisas"
                }
            },
            {
                $lookup:
                {
                    from: "cuentaspersonales",
                    localField: "_id",
                    foreignField: "cuenta",
                    as: "extra"
                }
            },
            { $unwind: { path: "$extra", preserveNullAndEmptyArrays: true } },
            {
                $lookup:
                {
                    from: "cuentasbancarias",
                    localField: "_id",
                    foreignField: "cuenta",
                    as: "extra2"
                }
            },
            { $unwind: { path: "$extra2", preserveNullAndEmptyArrays: true } },
            { $project:
                {
                    "nombre": "$nombre",
                    "noCuenta": "$extra2.noCuenta",
                    "banco": "$extra2.banco",
                    "tipo": "$tipo",
                    "divisas": "$divisas"
                }
            }
        ])
    }

    obtenerCuentas() {
        return Cuenta.aggregate([
            {   
                $match : { "estado": true }    
            },
            {
                $lookup:
                {
                    from: "divisas",
                    localField: "_id",
                    foreignField: "cuenta",
                    as: "divisas"
                }
            },
            {
                $lookup:
                {
                    from: "cuentaspersonales",
                    localField: "_id",
                    foreignField: "cuenta",
                    as: "extra"
                }
            },
            { $unwind: { path: "$extra", preserveNullAndEmptyArrays: true } },
            {
                $lookup:
                {
                    from: "cuentasbancarias",
                    localField: "_id",
                    foreignField: "cuenta",
                    as: "extra2"
                }
            },
            { $unwind: { path: "$extra2", preserveNullAndEmptyArrays: true } },
            { $project:
                {
                    "nombre": "$nombre",
                    "noCuenta": "$extra2.noCuenta",
                    "banco": "$extra2.banco",
                    "tipo": "$tipo",
                    "divisas": "$divisas"
                }
            }
        ])
    }

    eliminarCuenta(id: string) {
        return Cuenta.findByIdAndDelete(id);
    }

    eliminarCuentaBancaria(id: string) {
        return CuentaBancaria.findOneAndDelete({ cuenta: mongoose.Types.ObjectId(id) });
    }

    eliminarCuentaPersonal(id: string) {
        return CuentaPersonal.findOneAndDelete({ cuenta: mongoose.Types.ObjectId(id) });
    }
}

export = new CuentasController();