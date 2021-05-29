//https://ichi.pro/es/como-crear-una-aplicacion-de-backend-con-typescript-node-js-y-express-269453593828377
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import MasterRouter from './routers/MasterRouter';
import ErrorHandler from './models/ErrorHandler';

// load the environment variables from the .env file
dotenv.config({
    path: '.env'
});

class Server {
    public app = express();
    public router = MasterRouter;
}

const server = new Server();
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

//run mongo (mongod)
(async function() {
    await mongoose.connect('mongodb://localhost:27017/finanzas', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
})();

((port = process.env.APP_PORT || 5000) => {
    server.app.listen(port, () => console.log(`> Listening on port ${port}`));
})();