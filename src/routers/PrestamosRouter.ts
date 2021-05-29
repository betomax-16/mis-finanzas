import ErrorHandler from '../models/ErrorHandler';
import { NextFunction, Request, Response, Router } from 'express';
import PrsetamosController from '../controllers/PrsetamosController';
import Prestamo, { IPrestamo } from '../models/Prestamos/Prestamo';

class PrestamosRouter {
    private _router = Router({ mergeParams: true });
    private _controller = PrsetamosController;

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
                const result = await this._controller.obtenerPrestamos(req.params.id);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });

        this._router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const prestamo: IPrestamo = new Prestamo({ ...req.body, cuenta: req.params.id});
                const result = await this._controller.agregarPrestamo(prestamo);

                if (!result) {
                    throw new ErrorHandler(500, 'Error to create Prstamo');
                }
                else {
                    res.status(200).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });

        this._router.put('/:idPrestamo', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const prestamo: IPrestamo = new Prestamo({ ...req.body });
                const result = await this._controller.actualizarPrestamo(req.params.idPrestamo, prestamo);

                if (!result) {
                    throw new ErrorHandler(500, `Error to update Prestamo`);
                }
                else {
                    res.status(200).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });

        this._router.delete('/:idPrestamo', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this._controller.eliminarPrestamo(req.params.idPrestamo);
                if (!result) {
                    throw new ErrorHandler(500, `Error to delete Prestamo`);
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

export = new PrestamosRouter().router;