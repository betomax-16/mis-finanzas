import ErrorHandler from '../models/ErrorHandler';
import { NextFunction, Request, Response, Router } from 'express';
import TarjetasController from '../controllers/TarjetasController';
import CuentasController from '../controllers/CuentasController';
import Tarjeta, { ITarjeta } from '../models/Tarjetas/Tarjeta';
import TarjetaCredito, { ITarjetaCredito } from '../models/Tarjetas/TarjetaCredito';
import TarjetaDebito, { ITarjetaDebito } from '../models/Tarjetas/TarjetaDebito';
import MovimientosCrediticiosRouter from './MovimientosCrediticiosRouter';

class TarjetasRouter {
    private _router = Router({ mergeParams: true });
    private _controller = TarjetasController;
    private _controllerCuentas = CuentasController;
    private _subrouterMovimientos = MovimientosCrediticiosRouter;

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
              const resultCuenta = await this._controllerCuentas.obtenerCuenta(req.params.id);
              if (resultCuenta && resultCuenta.length > 0) {
                if (resultCuenta[0].tipo === 'bancaria') {
                  const result = await this._controller.obtenerTarjetas(req.params.id);
                  res.status(200).json(result);
                }
                else {
                  throw new ErrorHandler(404, 'Get cuenta not is "bancaria"');
                }
              }
              else {
                throw new ErrorHandler(404, 'Get cuenta not found');
              } 
            }
            catch (error) {
              next(error);
            }
        });

        this._router.get('/:idTarjeta', async (req: Request, res: Response, next: NextFunction) => {
            try {
              const resultCuenta = await this._controllerCuentas.obtenerCuenta(req.params.id);
              if (resultCuenta && resultCuenta.length > 0) {
                if (resultCuenta[0].tipo === 'bancaria') {
                  const result = await this._controller.obtenerTarjeta(req.params.idTarjeta);
                  if (result && result.length > 0) {
                    res.status(200).json(result[0]);
                  }
                  else {
                    throw new ErrorHandler(404, 'Get tarjeta not found');
                  }
                }
                else {
                  throw new ErrorHandler(404, 'Get cuenta not is "bancaria"');
                }
              }
              else {
                throw new ErrorHandler(404, 'Get cuenta not found');
              }
            }
            catch (error) {
              next(error);
            }
        });
        
        this._router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
              const resultCuenta = await this._controllerCuentas.obtenerCuenta(req.params.id);
              if (resultCuenta && resultCuenta.length > 0) {
                if (resultCuenta[0].tipo === 'bancaria') {
                  const tipo: string = req.body.montoLimite ? 'credito' : 'debito';
                  const tarjeta: ITarjeta = new Tarjeta({...req.body, tipo, cuenta: resultCuenta[0]._id });
                  const resultTarjeta = await this._controller.agregarTarjeta(tarjeta);
      
                  if (!resultTarjeta) {
                    throw new ErrorHandler(500, 'Error to create Tarjeta');
                  }
                  else {
                    const tarjetaCD: ITarjetaCredito|ITarjetaDebito = req.body.montoLimite
                        ? new TarjetaCredito({...req.body, tarjeta: resultTarjeta._id }) 
                        : new TarjetaDebito({...req.body, tarjeta: resultTarjeta._id });

                    const result = await this._controller.agregarTarjetaCreditoODebito(tarjetaCD);
                    
                    if (!result) {
                        throw new ErrorHandler(500, `Error to create tarjeta ${resultTarjeta.tipo}`);
                    }
                    else {
                        const resultT = await this._controller.obtenerTarjeta(resultTarjeta._id);
                        res.status(200).json(resultT[0]);
                    }
                  }
                }
                else {
                  throw new ErrorHandler(404, 'Get cuenta not is "bancaria"');
                }
              }
              else {
                throw new ErrorHandler(404, 'Get cuenta not found');
              }
            }
            catch (error) {
              next(error);
            }
        });

        this._router.put('/:idTarjeta', async (req: Request, res: Response, next: NextFunction) => {
            try {
              const resultCuenta = await this._controllerCuentas.obtenerCuenta(req.params.id);
              if (resultCuenta && resultCuenta.length > 0) {
                if (resultCuenta[0].tipo === 'bancaria') {
                  const tarjeta: ITarjeta = new Tarjeta({...req.body });
                  const resultTarjeta = await this._controller.actualizarTarjeta(req.params.idTarjeta, tarjeta);
      
                  if (!resultTarjeta) {
                    throw new ErrorHandler(500, `Error to update tarjeta`);
                  }
                  else {
                    const tarjetaCD: ITarjetaCredito|ITarjetaDebito =  req.body.montoLimite 
                      ? new TarjetaCredito({...req.body}) 
                      : new TarjetaDebito({...req.body});

                    const resultCD = await this._controller.actualizarTarjetaCreditoODebito(req.params.idTarjeta, tarjetaCD);
    
                    if (!resultCD) {
                      throw new ErrorHandler(500, `Error to update tarjeta ${resultTarjeta.tipo}`);
                    }
                    else {
                      const result = await this._controller.obtenerTarjeta(resultCD.tarjeta);
                      res.status(200).json(result[0]);
                    }
                  }
                }
                else {
                  throw new ErrorHandler(404, 'Get cuenta not is "bancaria"');
                }
              }
              else {
                throw new ErrorHandler(404, 'Get cuenta not found');
              }
            }
            catch (error) {
              next(error);
            }
        });

        this._router.use('/:idTarjeta/movimientos', this._subrouterMovimientos);
    }
}

export = new TarjetasRouter().router;