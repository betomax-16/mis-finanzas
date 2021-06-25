import  { Schema, param } from 'express-validator';
import CuentasController from '../../controllers/CuentasController';

async function checkIdCuenta(value: string) {
    const res = await CuentasController.obtenerCuenta(value);

    if (res.length !== 1) {
        return Promise.reject('id acount not exist or your status is false');
    }
}

const schema: Schema = {
    nombre: {
        custom: {
            options: async (value, { req, location, path }) => {
                if (req.body.nombre != null) {
                    if (value) {
                        if(typeof value !== 'string') {
                            return Promise.reject('Name isn`t string');
                        }
                        else {
                            // podria trabajar mejor con Graph QL
                            const result = await CuentasController.obtenerCuentas();
                            if (result.length > 0) {
                                const resFilter = result.find(r => r.nombre == value);
                                if (resFilter) {
                                    return Promise.reject('Name already in use');
                                }
                            }
                        }
                    }
                    else {
                        return Promise.reject('Name can`t empty');
                    }
                }
            }
        }
    },
    estado: {
        optional: true,
        isBoolean: {
            errorMessage: 'Status isn`t boolean',
        }
    },
    noCuenta: {
        custom: {
            options: async (value, { req, location, path }) => {
                if (req.body.noCuenta != null) {
                    if (value) {
                        if(typeof value !== 'string') {
                            return Promise.reject('Acount Number isn`t string');
                        }
                        else {
                            // podria trabajar mejor con Graph QL
                            const result = await CuentasController.obtenerCuentas();
                            if (result.length > 0) {
                                const resFilter = result.find(r => r.tipo == 'bancaria' && r.noCuenta == value);
                                if (resFilter) {
                                    return Promise.reject('Acount Number already in use');
                                }
                            }
                        }
                    }
                    else {
                        return Promise.reject('Acount Number can`t empty');
                    }
                }
            }
        }
    },
    banco: {
        custom: {
            options: async (value, { req, location, path }) => {
                if (req.body.banco != null) {
                    if (value) {
                        if(typeof value !== 'string') {
                            return Promise.reject('Bank isn`t string');
                        }
                    }
                    else {
                        return Promise.reject('Bank can`t empty');
                    }
                }
            }
        }
    }
}

export default {schema, checkIdCuenta};