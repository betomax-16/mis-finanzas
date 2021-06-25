import ErrorHandler from '../models/ErrorHandler';
import { NextFunction, Request, Response, Router } from 'express';
import CuentasController from '../controllers/CuentasController';
import Divisa, { IDivisa } from '../models/Divisas/Divisa';
import MovimientoFijoController from '../controllers/MovimientoFijoController';
import MovimientoFijo, { IMovimientoFijo } from '../models/Movimientos/MovimientoFijo';

import { checkSchema, validationResult, param } from 'express-validator';
import CuentasUpdateSchema from '../validators/Cuentas/CuentasUpdateSchema';
import MovimientoFijoSchema from '../validators/Movimientos/MovimientoFijoSchema';
import MovimientoFijoUpdateSchema from '../validators/Movimientos/MovimientoFijoUpdateSchema';

class MovimientosRouter {
    private _router = Router({ mergeParams: true });
    private _controller = MovimientoFijoController;

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
        this._router.get('/', param('id').custom(CuentasUpdateSchema.checkIdCuenta), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array()
                    });
                }

                const result = await this._controller.obtenerMovimientos(req.params.id);
                if (!result) {
                    throw new ErrorHandler(404, 'Get movimientos not found"');
                }
                else {
                    res.status(200).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });

        this._router.get('/:idMovimiento', param('id').custom(CuentasUpdateSchema.checkIdCuenta), param('idMovimiento').custom(MovimientoFijoSchema.checkIdTransaction), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array()
                    });
                }

                const result = await this._controller.obtenerMovimiento(req.params.idMovimiento);
                if (!result) {
                    throw new ErrorHandler(404, 'Get movimiento not found"');
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
                     checkSchema(MovimientoFijoSchema.schema),
                     async (req: Request, res: Response, next: NextFunction) => {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array()
                    });
                }

                const movimiento: IMovimientoFijo = new MovimientoFijo({ ...req.body, cuenta: req.params.id });
                const result = await this._controller.agregarMovimiento(movimiento);
                
                if (!result) {
                    throw new ErrorHandler(500, `Error to create movimiento`);
                }
                else {
                    const resCuenta = await CuentasController.obtenerCuenta(req.params.id);
                    
                    if (resCuenta.length === 1) {
                        const div = resCuenta[0].divisas.find((divisa: IDivisa) => divisa.codigo == req.body.codigoDivisa);

                        if (div) {
                            res.status(200).json(result);
                            // const resDiv = await Divisa.findByIdAndUpdate(div._id, { monto: div.monto + req.body.monto }, {new: true, useFindAndModify: false});

                            // if (resDiv) {
                            //     res.status(200).json(result);
                            // }
                            // else {
                            //     throw new ErrorHandler(500, `Error to update amount from your acount`);
                            // }
                        }
                        else {
                            throw new ErrorHandler(500, `Error not found code divisa from your acount`);
                        }
                    }
                    else {
                        throw new ErrorHandler(500, `Error acount not found`);
                    }
                }
            }
            catch (error) {
                next(error);
            }
        });

        this._router.put('/:idMovimiento', 
                     param('id').custom(CuentasUpdateSchema.checkIdCuenta), 
                     param('idMovimiento').custom(MovimientoFijoSchema.checkIdTransaction),
                     checkSchema(MovimientoFijoUpdateSchema.schema),
                     async (req: Request, res: Response, next: NextFunction) => {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array()
                    });
                }

                const result = await this._controller.actualizarMovimiento(req.params.idMovimiento, req.body);

                if (!result) {
                    throw new ErrorHandler(500, `Error to update movimiento`);
                }
                else {
                    res.status(200).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });

        this._router.delete('/:idMovimiento', 
                     param('id').custom(CuentasUpdateSchema.checkIdCuenta), 
                     param('idMovimiento').custom(MovimientoFijoSchema.checkIdTransaction),
                     async (req: Request, res: Response, next: NextFunction) => {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array()
                    });
                }

                const result = await this._controller.eliminarMovimiento(req.params.idMovimiento);

                if (!result) {
                    throw new ErrorHandler(500, `Error to delete movimiento`);
                }
                else {
                    res.status(200).json({message: 'Movimiento eliminado exitosamente'});
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}

export = new MovimientosRouter().router;