import ErrorHandler from '../models/ErrorHandler';
import { NextFunction, Request, Response, Router } from 'express';
import IngresosController from '../controllers/IngresosController';
import Ingreso, { IIngreso } from '../models/Movimientos/Programados/Ingreso';

class IngresosRouter {
    private _router = Router({ mergeParams: true });
    private _controller = IngresosController;

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
                const result = await this._controller.obtenerIngresos(req.params.id);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });

        this._router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const ingreso: IIngreso = new Ingreso({ ...req.body, cuenta: req.params.id});
                const result = await this._controller.agregarIngreso(ingreso);

                if (!result) {
                    throw new ErrorHandler(500, 'Error to create Ingreso');
                }
                else {
                    res.status(200).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });

        this._router.put('/:idIngreso', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const ingreso: IIngreso = new Ingreso({ ...req.body });
                const result = await this._controller.actualizarIngreso(req.params.idIngreso, ingreso);

                if (!result) {
                    throw new ErrorHandler(500, `Error to update Ingreso`);
                }
                else {
                    res.status(200).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });

        this._router.delete('/:idIngreso', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this._controller.eliminarIngreso(req.params.idIngreso);
                if (!result) {
                    throw new ErrorHandler(500, `Error to delete Ingreso`);
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

export = new IngresosRouter().router;