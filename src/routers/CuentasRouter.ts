import ErrorHandler from '../models/ErrorHandler';
import { NextFunction, Request, Response, Router } from 'express';
import CuentasController from '../controllers/CuentasController';
import DivisasController from '../controllers/DivisasController';
import Cuenta, { ICuenta } from '../models/Cuentas/Cuenta';
import CuentaBancaria, { ICuentaBancaria } from '../models/Cuentas/CuentaBancaria';
import CuentaPersonal, { ICuentaPersonal } from '../models/Cuentas/CuentaPersonal';
import Divisa, { IDivisa } from '../models/Divisas/Divisa';
import DivisasRouter from './DivisasRouter';
import TarjetasRouter from './TarjetasRouter';
import MovimientosRouter from './MovimientosRouter';
import MovimientosFijosRouter from './MovimientosFijosRouter';
import PrestamosRouter from './PrestamosRouter';

import { checkSchema, validationResult, param } from 'express-validator';
import CuentaSchema from '../validators/Cuentas/CuentaSchema';
import CuentasUpdateSchema from '../validators/Cuentas/CuentasUpdateSchema';


class CuentasRouter {
    private _router = Router();
    private _controller = CuentasController;
    private _subrouterDivisas = DivisasRouter;
    private _subrouterTarjetas = TarjetasRouter;
    private _subrouterMovimientos = MovimientosRouter;
    private _subrouterMovimientosFijos = MovimientosFijosRouter;
    private _subrouterPrestamos = PrestamosRouter;

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
            const result = await this._controller.obtenerCuentas();
            res.status(200).json(result);
          }
          catch (error) {
            next(error);
          }
      });

      this._router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
          try {
              const result = await this._controller.obtenerCuenta(req.params.id);
              if (result && result.length > 0) {
                res.status(200).json(result[0]);
              }
              else {
                throw new ErrorHandler(404, 'Get cuenta not found');
                // res.status(400).json({ error: `Get cuenta empty` });
              }
            }
            catch (error) {
              next(error);
            }
      });

      this._router.post('/', checkSchema(CuentaSchema), async (req: Request, res: Response, next: NextFunction) => {
          try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }

            const tipo: string = req.body.noCuenta && req.body.banco ? 'bancaria' : 'personal';
            const cuenta: ICuenta = new Cuenta({...req.body, tipo, estado: true });
            const resultCuenta = await this._controller.agregarCuenta(cuenta);

            if (!resultCuenta) {
              throw new ErrorHandler(500, 'Error to create Cuenta');
              // res.status(400).json({ error: 'Create cuenta' });
            }
            else {
              const divisa: IDivisa = new Divisa({ cuenta: resultCuenta._id });
              const resDiv = DivisasController.agregarDivisa(divisa);

              if (!resDiv) {
                throw new ErrorHandler(500, `Error to create divisa`);
              }
              else {
                const cuentaBP: ICuentaBancaria|ICuentaPersonal = req.body.noCuenta && req.body.banco
                  ? new CuentaBancaria({...req.body, cuenta: resultCuenta._id }) 
                  : new CuentaPersonal({...req.body, cuenta: resultCuenta._id });

                const result = await this._controller.agregarCuentaBancariaOPersonal(cuentaBP);
                
                if (!result) {
                  throw new ErrorHandler(500, `Error to create cuenta ${resultCuenta.tipo}`);
                  // res.status(400).json({ error: `Create cuenta ${resultCuenta.tipo}` });
                }
                else {

                  const resultC = await this._controller.obtenerCuenta(result.cuenta);
                  res.status(200).json(resultC[0]);
                }
              }
            }
          }
          catch (error) {
            next(error);
          }
      });

      this._router.put('/:id', param('id').custom(CuentasUpdateSchema.checkIdCuenta), checkSchema(CuentasUpdateSchema.schema), async (req: Request, res: Response, next: NextFunction) => {
          try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }

            const cuenta: ICuenta = new Cuenta({...req.body });
            const resultCuenta = await this._controller.actualizarCuenta(req.params.id, cuenta);

            if (!resultCuenta) {
              throw new ErrorHandler(500, `Error to update cuenta`);
              // res.status(400).json({ error: 'Update cuenta' });
            }
            else {
              if (req.body.noCuenta || req.body.banco) {
                const cuenta: ICuentaBancaria = new CuentaBancaria({...req.body});
                const result = await this._controller.actualizarCuentaBancariaOPersonal(req.params.id, cuenta);

                if (!result) {
                  throw new ErrorHandler(500, `Error to update cuenta ${resultCuenta.tipo}`);
                  // res.status(400).json({ error: `Update cuenta ${resultCuenta.tipo}` });
                }
                else {
                  if (resultCuenta.estado) {
                    const resultC = await this._controller.obtenerCuenta(result.cuenta);
                    res.status(200).json(resultC[0]);
                  }
                  else {
                    res.status(200).json({message: "Cuenta cancelada exitosamente"});
                  }
                }
              }
              else {
                if (resultCuenta.estado) {
                  const resultC = await this._controller.obtenerCuenta(resultCuenta._id);
                  res.status(200).json(resultC[0]);
                }
                else {
                  res.status(200).json({message: "Cuenta cancelada exitosamente"});
                }
              }
            }
          }
          catch (error) {
            next(error);
          }
      });

      this._router.put('/:id/activar', async (req: Request, res: Response, next: NextFunction) => {
        try {
          const resultCuenta = await this._controller.activarCuenta(req.params.id);

          if (!resultCuenta) {
            throw new ErrorHandler(500, `Error to active cuenta`);
          }
          else {
            const result = await this._controller.obtenerCuenta(req.params.id);
            res.status(200).json(result[0]);
          }
        }
        catch (error) {
          next(error);
        }
    });

      this._router.use('/:id/divisas', this._subrouterDivisas);

      this._router.use('/:id/tarjetas', this._subrouterTarjetas);

      this._router.use('/:id/movimientos', this._subrouterMovimientos);

      this._router.use('/:id/movimientosfijos', this._subrouterMovimientosFijos);

      // this._router.use('/:id/prestamos', this._subrouterPrestamos);
    }
}

export = new CuentasRouter().router;