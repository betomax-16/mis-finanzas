
import { Router } from 'express';
import CuentasRouter from './CuentasRouter';


class MasterRouter {
    private _router = Router();
    private _subrouterCuentas = CuentasRouter;

    get router() {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    /**
     * Connect routes to their matching routers.
     */
    private _configure() {
        this._router.use('/cuentas', this._subrouterCuentas);
    }
}

export = new MasterRouter().router;