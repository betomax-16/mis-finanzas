import ErrorHandler from '../models/ErrorHandler';
import { NextFunction, Request, Response, Router } from 'express';
import DivisasController from '../controllers/DivisasController';
import Divisa, { IDivisa } from '../models/Divisas/Divisa';

import { checkSchema, validationResult, param } from 'express-validator';
import CuentasUpdateSchema from '../validators/Cuentas/CuentasUpdateSchema';
import DivisaSchema from '../validators/Divisas/DivisaSchema';
import DivisaUpdateSchema from '../validators/Divisas/DivisaUpdateSchema';

class DivisasRouter {
    private _router = Router({ mergeParams: true });
    private _controller = DivisasController;

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
        this._router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this._controller.obtenerDivisas(req.params.id);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });

        this._router.post('/', param('id').custom(CuentasUpdateSchema.checkIdCuenta), checkSchema(DivisaSchema.schema), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array()
                    });
                }

                const divisa: IDivisa = new Divisa({ ...req.body, cuenta: req.params.id});
                const resultDivisa = await this._controller.agregarDivisa(divisa);

                if (!resultDivisa) {
                    throw new ErrorHandler(500, 'Error to create Divisa');
                }
                else {
                    res.status(200).json(resultDivisa);
                }
            }
            catch (error) {
                next(error);
            }
        });

        this._router.put('/:idDivisa', 
                     param('id').custom(CuentasUpdateSchema.checkIdCuenta), 
                     param('idDivisa').custom(DivisaUpdateSchema.checkIdDivisa), 
                     checkSchema(DivisaUpdateSchema.schema), 
                     async (req: Request, res: Response, next: NextFunction) => {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array()
                    });
                }

                const divisa: IDivisa = new Divisa({ ...req.body });
                const resultDivisa = await this._controller.actualizarDivisa(req.params.idDivisa, divisa);

                if (!resultDivisa) {
                    throw new ErrorHandler(500, `Error to update cuenta`);
                }
                else {
                    res.status(200).json(resultDivisa);
                }
            }
            catch (error) {
                next(error);
            }
        });

        this._router.delete('/:idDivisa', param('id').custom(CuentasUpdateSchema.checkIdCuenta), async (req: Request, res: Response, next: NextFunction) => {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array()
                    });
                }

                const result = await this._controller.eliminarDivisa(req.params.idDivisa);
                if (!result) {
                    throw new ErrorHandler(500, `Error to delete divisa`);
                }
                else {
                    res.status(200).json({message: 'Eliminación exitosa'});
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}

export = new DivisasRouter().router;