import ErrorHandler from '../models/ErrorHandler';
import { NextFunction, Request, Response, Router } from 'express';
import MovimientoCrediticioController from '../controllers/MovimientoCrediticioController';
import MovimientoCrediticio, { IMovimientoCrediticio } from '../models/Movimientos/MovimientoCrediticio';

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
        this._router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
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

        this._router.get('/:idMovimiento', async (req: Request, res: Response, next: NextFunction) => {
            try {
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
        
        this._router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const movimiento: IMovimientoCrediticio = new MovimientoCrediticio({ ...req.body, tarjeta: req.params.id });
                const result = await this._controller.agregarMovimientoCrediticio(movimiento);
                
                if (!result) {
                    throw new ErrorHandler(500, `Error to create movimiento crediticio`);
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
                const movimiento: IMovimientoCrediticio = new MovimientoCrediticio({ ...req.body });
                const result = await this._controller.actualizarMovimientoCrediticio(req.params.idMovimiento, movimiento);

                if (!result) {
                    throw new ErrorHandler(500, `Error to update movimiento crediticio`);
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
                const result = await this._controller.eliminarMovimientoCrediticio(req.params.idMovimiento);

                if (!result) {
                    throw new ErrorHandler(500, `Error to update movimiento crediticio`);
                }
                else {
                    res.status(200).json({message: 'Movimiento crediticio eliminado exitosamente'});
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}

export = new MovimientosCrediticiosRouter().router;