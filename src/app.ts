//https://ichi.pro/es/como-crear-una-aplicacion-de-backend-con-typescript-node-js-y-express-269453593828377
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import MasterRouter from './routers/MasterRouter';
import ErrorHandler from './models/ErrorHandler';
import cors from 'cors';
import cron from 'node-cron';
import moment from 'moment';

import MovimientoFijo from './models/Movimientos/MovimientoFijo';
import Movimiento, { IMovimiento } from './models/Movimientos/Movimiento';

// load the environment variables from the .env file
dotenv.config({
    path: '.env'
});

const corsOptions: cors.CorsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
}

class Server {
    public app = express();
    public router = MasterRouter;

    constructor() {
        cron.schedule('0 0 * * *', async () => {
            try {
                let currentDate = moment();
                
                const resMF = await MovimientoFijo.find({ fechaLimitePago : { "$lte" : currentDate.toDate() } });

                if (resMF) {
                    resMF.forEach(async element => {
                        let mov: IMovimiento = new Movimiento({
                            cuenta: mongoose.Types.ObjectId(element.cuenta),
                            monto: element.monto,
                            codigoDivisa: element.codigoDivisa,
                            fecha: element.fechaLimitePago,
                            motivo: element.motivo,
                            estado: false
                        });

                        if (element.recurrencia > 0) {
                            const resM = await mov.save();
    
                            if (resM) {
                                let dateTransaction = moment(element.fechaLimitePago);
                                switch (element.perioricidad) {
                                    case 'dia':
                                        dateTransaction.add(element.agrupamiento, 'd');
                                        break;
                                    case 'semana':
                                        dateTransaction.add(element.agrupamiento, 'w');
                                        break;
                                    case 'mes':
                                        dateTransaction.add(element.agrupamiento, 'M');
                                        break;
                                    case 'año':
                                        dateTransaction.add(element.agrupamiento, 'y');
                                        break;
                                }

                                if (element.recurrencia - 1 == 0) {
                                    await MovimientoFijo.findByIdAndRemove(element._id);
                                }
                                else {
                                    await MovimientoFijo.findByIdAndUpdate(element._id, { fechaLimitePago: dateTransaction.toDate(), recurrencia: element.recurrencia - 1 });
                                }
                            }
                        }
                        else if (element.recurrencia <= 0) {
                            const resM = await mov.save();
    
                            if (resM) {
                                let dateTransaction = moment(element.fechaLimitePago);
                                switch (element.perioricidad) {
                                    case 'dia':
                                        dateTransaction.add(element.agrupamiento, 'd');
                                        break;
                                    case 'semana':
                                        dateTransaction.add(element.agrupamiento, 'w');
                                        break;
                                    case 'mes':
                                        dateTransaction.add(element.agrupamiento, 'M');
                                        break;
                                    case 'año':
                                        dateTransaction.add(element.agrupamiento, 'y');
                                        break;
                                }
                                
                                await MovimientoFijo.findByIdAndUpdate(element._id, { fechaLimitePago: dateTransaction.toDate() });
                            }
                        }
                        
                    });
                }
            } catch (error) {
                console.log(error);
            }
        });
    }
}

const server = new Server();
server.app.use(cors(corsOptions));
// equivalente a body parse
server.app.use(express.json());
server.app.use('/api', server.router);
server.app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
        status: 'error',
        statusCode: err.statusCode,
        message: err.message
    });
});

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV, APP_PORT } = process.env;

//run mongo (mongod)
(async function() {
    const conn = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI;
    await mongoose.connect(conn!, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
})();

let serverListener;
((port = APP_PORT || 5000) => {
    serverListener = server.app.listen(port, () => console.log(`> Listening on port ${port}`));
})();

export default {serverListener, app: server.app};