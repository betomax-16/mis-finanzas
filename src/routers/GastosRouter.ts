import ErrorHandler from '../models/ErrorHandler';
import { NextFunction, Request, Response, Router } from 'express';
import GastosController from '../controllers/GastosController';
import Gasto, { IGasto } from '../models/Movimientos/Programados/Gasto';

class GastosRouter {
    private _router = Router({ mergeParams: true });
    private _controller = GastosController;

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
                const result = await this._controller.obtenerGastos(req.params.id);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });

        this._router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const gasto: IGasto = new Gasto({ ...req.body, cuenta: req.params.id});
                const result = await this._controller.agregarGasto(gasto);

                if (!result) {
                    throw new ErrorHandler(500, 'Error to create Gasto');
                }
                else {
                    res.status(200).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });

        this._router.put('/:idGasto', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const gasto: IGasto = new Gasto({ ...req.body });
                const result = await this._controller.actualizarGasto(req.params.idGasto, gasto);

                if (!result) {
                    throw new ErrorHandler(500, `Error to update Gasto`);
                }
                else {
                    res.status(200).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });

        this._router.delete('/:idGasto', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this._controller.eliminarGasto(req.params.idGasto);
                if (!result) {
                    throw new ErrorHandler(500, `Error to delete Gasto`);
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

export = new GastosRouter().router;