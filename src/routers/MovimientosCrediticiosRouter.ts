import ErrorHandler from '../models/ErrorHandler';
import { NextFunction, Request, Response, Router } from 'express';
import MovimientoCrediticioController from '../controllers/MovimientoCrediticioController';
import MovimientoCrediticio, { IMovimientoCrediticio } from '../models/Movimientos/MovimientoCrediticio';
import TarjetaCredito from '../models/Tarjetas/TarjetaCredito';
import mongoose from 'mongoose';

import { checkSchema, validationResult, param } from 'express-validator';
import CuentasUpdateSchema from '../validators/Cuentas/CuentasUpdateSchema';
import TarjetaUpdateSchema from '../validators/Tarjetas/TarjetaUpdateSchema';
import MovimientosCrediticiosSchema from '../validators/Movimientos/MovimientosCrediticiosSchema';

class MovimientosCrediticiosRouter {
    private _router = Router({ mergeParams: true });
    private _controller = MovimientoCrediticioController;

    get router() {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    /**
     * Connect routes to their matching controller endpoints.
     */
    private _configure() {
        this._router.get('/', 
                     param('id').custom(CuentasUpdateSchema.checkIdCuenta), 
                     param('idTarjeta').custom(TarjetaUpdateSchema.isValidCard), 
                     param('idTarjeta').custom(MovimientosCrediticiosSchema.isCreditCard), 
                     async (req: Request, res: Response, next: NextFunction) => {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array()
                    });
                }

                const result = await this._controller.obtenerMovimientosCrediticios(req.params.idTarjeta);
                if (!result) {
                    throw new ErrorHandler(404, 'Get movimientos crediticios not found"');
                }
                else {
                    res.status(200).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });

        this._router.get('/:idMovimiento', 
                     param('id').custom(CuentasUpdateSchema.checkIdCuenta), 
                     param('idTarjeta').custom(TarjetaUpdateSchema.isValidCard), 
                     param('idTarjeta').custom(MovimientosCrediticiosSchema.isCreditCard), 
                     param('idMovimiento').custom(MovimientosCrediticiosSchema.checkIdTransactionCard), 
                     async (req: Request, res: Response, next: NextFunction) => {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array()
                    });
                }

                const result = await this._controller.obtenerMovimientoCrediticio(req.params.idMovimiento);
                if (!result) {
                    throw new ErrorHandler(404, 'Get movimiento crediticio not found"');
                }
                else {
                    res.status(200).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });
        
        this._router.post('/', 
                     param('id').custom(CuentasUpdateSchema.checkIdCuenta), 
                     param('idTarjeta').custom(TarjetaUpdateSchema.isValidCard), 
                     param('idTarjeta').custom(MovimientosCrediticiosSchema.isCreditCard), 
                     checkSchema(MovimientosCrediticiosSchema.schema),
                     async (req: Request, res: Response, next: NextFunction) => {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array()
                    });
                }

                const movimiento: IMovimientoCrediticio = new MovimientoCrediticio({ ...req.body, tarjeta: req.params.idTarjeta });
                const result = await this._controller.agregarMovimientoCrediticio(movimiento);
                
                if (!result) {
                    throw new ErrorHandler(500, `Error to create movimiento crediticio`);
                }
                else {
                    const resTarjeta = await TarjetaCredito.findOne({tarjeta: mongoose.Types.ObjectId(req.params.idTarjeta)});
                    
                    if (resTarjeta) {
                        const resUp = await TarjetaCredito.findByIdAndUpdate(resTarjeta._id, { montoDisponible: resTarjeta.montoDisponible + req.body.monto }, {new: true, useFindAndModify: false});

                        if (resUp) {
                            res.status(200).json(result);
                        }
                        else {
                            throw new ErrorHandler(500, `Error to update amount available from your credit card`);
                        }
                    }
                    else {
                        throw new ErrorHandler(500, `Error credit card not found`);
                    }
                }
            }
            catch (error) {
                next(error);
            }
        });

        this._router.delete('/:idMovimiento', 
                     param('id').custom(CuentasUpdateSchema.checkIdCuenta), 
                     param('idTarjeta').custom(TarjetaUpdateSchema.isValidCard), 
                     param('idTarjeta').custom(MovimientosCrediticiosSchema.isCreditCard), 
                     param('idMovimiento').custom(MovimientosCrediticiosSchema.checkIdTransactionCard), 
                     async (req: Request, res: Response, next: NextFunction) => {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array()
                    });
                }

                const result = await this._controller.eliminarMovimientoCrediticio(req.params.idMovimiento);

                if (!result) {
                    throw new ErrorHandler(500, `Error to update movimiento crediticio`);
                }
                else {
                    const resTarjeta = await TarjetaCredito.findOne({tarjeta: mongoose.Types.ObjectId(req.params.idTarjeta)});
                    
                    if (resTarjeta) {
                        const resUp = await TarjetaCredito.findByIdAndUpdate(resTarjeta._id, { montoDisponible: resTarjeta.montoDisponible - result.monto }, {new: true, useFindAndModify: false});

                        if (resUp) {
                            res.status(200).json({message: 'Movimiento crediticio eliminado exitosamente'});
                        }
                        else {
                            throw new ErrorHandler(500, `Error to update amount available from your credit card`);
                        }
                    }
                    else {
                        throw new ErrorHandler(500, `Error credit card not found`);
                    }
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}

export = new MovimientosCrediticiosRouter().router;