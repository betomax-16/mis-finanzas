import  { Schema } from 'express-validator';
import { IDivisa } from '../../models/Divisas/Divisa';
import MovimientoFijo from '../../models/Movimientos/MovimientoFijo';
import CuentasController from '../../controllers/CuentasController';
import MovimientoFijoSchema from './MovimientoFijoSchema';

const schema: Schema = {
    monto: {
        custom: {
            options: async (value, { req, location, path }) => {
                if (value) {
                    if(typeof value !== 'number') {
                        return Promise.reject('Amount isn`t number');
                    }
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
                        else {
                            const res = await CuentasController.obtenerCuenta(req.params!.id);

                            if (res.length === 1 && res[0].divisas) {
                                const found = res[0].divisas.find((divisa: IDivisa) => divisa.codigo == value);

                                if (!found) {
                                    return Promise.reject('Code not found');
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    fechaLimitePago: {
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
                        if (!MovimientoFijoSchema.isFutureDate(date)) {
                            return Promise.reject('The date it is not a future date');
                        }

                        return true;
                    }
                }
            }
        }
    },
    motivo: {
        optional: true,
        isString: {
            errorMessage: 'Reason isn`t string'
        },
        notEmpty: {
            errorMessage: 'Reason can`t empty'
        },
    },
    perioricidad: {
        optional: true,
        isString: {
            errorMessage: 'Periodicity isn`t string'
        },
        notEmpty: {
            errorMessage: "Periodicity can`t empty",
        },
        isIn: {
            errorMessage: "Periodicity is diferent to anual or mensual or semanal or diaria",
            options: [['año', 'mes', 'semana', 'dia']]
        },
    },
    agrupamiento: {
        custom: {
            options: (value, { req, location, path }) => {
                if (value) {
                    if(typeof value !== 'number') {
                        return Promise.reject('grouping isn`t number');
                    }
                    else {                        
                        if (value < 0) {
                            return Promise.reject('grouping can`t be less than zero');
                        }

                        if (value % 1 !== 0) {
                            return Promise.reject('grouping can`t be a decimal');
                        }

                        return true;
                    }
                }
            }
        }
    },
    recurrencia: {
        custom: {
            options: (value, { req, location, path }) => {
                if (value || value === 0) {
                    if(typeof value !== 'number') {
                        return Promise.reject('recurrence isn`t number');
                    }
                    else {                        
                        if (value < 0) {
                            return Promise.reject('recurrence can`t be less than zero');
                        }
                        
                        if (value % 1 !== 0) {
                            return Promise.reject('recurrence can`t be a decimal');
                        }

                        return true;
                    }
                }
            }
        }
    },
    cargo: {
        optional: true,
        isNumeric: {
            errorMessage: 'Charge isn`t string'
        },
        notEmpty: {
            errorMessage: "Charge can`t empty",
        },
    }
}

export default { schema };