//https://express-validator.github.io/docs/schema-validation.html
//https://stackabuse.com/form-data-validation-in-nodejs-with-express-validator
import  { Schema } from 'express-validator';
import CuentasController from '../../controllers/CuentasController';

const cuentaSchema: Schema = {
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
                else {
                    return Promise.reject('The "nombre" field is required');
                }
            }
        }
    },
    // estado: {
    //     notEmpty: {
    //         errorMessage: 'Status field cannot be empty',
    //     },
    //     isBoolean: {
    //         errorMessage: 'Status isn`t boolean',
    //     }
    // },
    // tipo: {
    //     notEmpty: {
    //         errorMessage: "Type can`t empty",
    //     },
    //     isIn: {
    //         errorMessage: "Type is diferent to personal or bancaria",
    //         options: [['personal', 'bancaria']]
    //     },
    // },
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

                            if (req.body.banco == null) {
                                return Promise.reject('The "banco" field is required');
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
                    if (req.body.noCuenta != null) {
                        if (value) {
                            if(typeof value !== 'string') {
                                return Promise.reject('Bank isn`t string');
                            }
                        }
                        else {
                            return Promise.reject('Bank can`t empty');
                        }
                    }
                    else {
                        return Promise.reject('The "noCuenta" field is required');
                    }
                }
            }
        }
    }
}

export default cuentaSchema;