import  { Schema } from 'express-validator';
import { IDivisa } from '../../models/Divisas/Divisa';
import Movimiento from '../../models/Movimientos/Movimiento';
import CuentasController from '../../controllers/CuentasController';

function isOldDate(date: Date) {
    const now = new Date();
    return date.getTime() <= now.getTime();
}

async function checkIdTransaction(id: string) {
    const res = await Movimiento.findById(id);

    if (!res) {
        return Promise.reject('id transaction not exist');
    }
}

const schema: Schema = {
    monto: {
        custom: {
            options: async (value, { req, location, path }) => {
                if (value || value === 0) {
                    if(typeof value !== 'number') {
                        return Promise.reject('Amount isn`t number');
                    }
                    else {
                        if (req.body.hasOwnProperty('codigoDivisa')) {
                            const res = await CuentasController.obtenerCuenta(req.params!.id);

                            if (res.length === 1 && res[0].divisas) {
                                const found = res[0].divisas.find((divisa: IDivisa) => divisa.codigo == req.body.codigoDivisa);

                                if (found) {
                                    if (value < 0 && (found.monto + value) < 0) {
                                        return Promise.reject('Amount can`t number greater than Amoun of your Acount');
                                    }
                                }
                                else {
                                    return Promise.reject('Code not found');
                                }
                            }
                        }
                    }
                }
                else {
                    return Promise.reject('Code can`t empty');
                }
            }
        }
    },
    codigoDivisa: {
        custom: {
            options: async (value, { req, location, path }) => {
                if (value) {
                    if(typeof value !== 'string') {
                        return Promise.reject('Code isn`t string');
                    }
                    else {
                        if (value.length !== 3) {
                            return Promise.reject('Code should be at 3 chars long.');
                        }
                    }
                }
                else {
                    return Promise.reject('Code can`t empty');
                }
            }
        }
    },
    fecha: {
        custom: {
            options: (value, { req, location, path }) => {
                if (value) {
                    if(typeof value !== 'string') {
                        return Promise.reject('date isn`t string');
                    }
                    else {                        
                        if (!/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(value)) {
                            return Promise.reject('The date not have format yyyy-mm-dd');
                        }

                        const digits = value.split('-');
                        const date = new Date(parseInt(digits[0]), parseInt(digits[1]) - 1, parseInt(digits[2]));
                        if (!isOldDate(date)) {
                            return Promise.reject('The date it is not a old date');
                        }

                        return true;
                    }
                }
                else {
                    return Promise.reject('date can`t empty');
                }
            }
        }
    },
    motivo: {
        isString: {
            errorMessage: 'Reason isn`t string'
        },
        notEmpty: {
            errorMessage: 'Reason can`t empty'
        },
    },
    estado: {
        optional: true,
        isBoolean: {
            errorMessage: 'State isn`t boolean'
        }
    }
}

export default { schema, isOldDate, checkIdTransaction };