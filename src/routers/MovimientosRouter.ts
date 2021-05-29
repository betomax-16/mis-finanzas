import ErrorHandler from '../models/ErrorHandler';
import { NextFunction, Request, Response, Router } from 'express';
import MovimientoContorller from '../controllers/MovimientoContorller';
import Movimiento, { IMovimiento } from '../models/Movimientos/Movimiento';

class MovimientosRouter {
    private _router = Router({ mergeParams: true });
    private _controller = MovimientoContorller;

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

        this._router.get('/:idMovimiento', async (req: Request, res: Response, next: NextFunction) => {
            try {
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
        
        this._router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const movimiento: IMovimiento = new Movimiento({ ...req.body, cuenta: req.params.id });
                const result = await this._controller.agregarMovimiento(movimiento);
                
                if (!result) {
                    throw new ErrorHandler(500, `Error to create movimiento`);
                }
                else {
                    res.status(200).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });

        this._router.put('/:idMovimiento', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const movimiento: IMovimiento = new Movimiento({ ...req.body });
                const result = await this._controller.actualizarMovimiento(req.params.idMovimiento, movimiento);

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

        this._router.delete('/:idMovimiento', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this._controller.eliminarMovimiento(req.params.idMovimiento);

                if (!result) {
                    throw new ErrorHandler(500, `Error to update movimiento`);
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