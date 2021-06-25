import  { Schema } from 'express-validator';
import MovimientoCrediticio from '../../models/Movimientos/MovimientoCrediticio';
import TarjetasController from '../../controllers/TarjetasController';
import MovimientoSchema from './MovimientoSchema';


async function checkIdTransactionCard(id: string) {
    const res = await MovimientoCrediticio.findById(id);

    if (!res) {
        return Promise.reject('id transaction not exist');
    }
}

async function isCreditCard(id: string) {
    const res = await TarjetasController.obtenerTarjeta(id);

    if (res.length === 1) {
        if (res[0].tipo !== 'credito') {
            return Promise.reject('id isn`t credti card');
        }
    }
    else {
        return Promise.reject('id card not exist');
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
                            const res = await TarjetasController.obtenerTarjeta(req.params!.idTarjeta);

                            if (res.length === 1) {
                                if (res[0].codigo == req.body.codigoDivisa) {
                                    if (value < 0) {
                                        if ((res[0].montoDisponible + value) < 0) {
                                            return Promise.reject('Amount can`t number greater than your amount available in the credit card');
                                        }
                                    }
                                    else {
                                        return Promise.reject('Amount isn`t negative number');
                                    }
                                }
                                else {
                                    return Promise.reject('Code not match');
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
                        if (!MovimientoSchema.isOldDate(date)) {
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
}

export default { schema, checkIdTransactionCard, isCreditCard };