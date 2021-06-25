import  { Schema } from 'express-validator';
import TarjetaCredito, { ITarjetaCredito } from '../../models/Tarjetas/TarjetaCredito';
import TarjetasController from '../../controllers/TarjetasController';
import TarjetaSchema from './TarjetaSchema';
import mongoose from 'mongoose';

async function isValidCard(value: string) {
    const res = await TarjetasController.obtenerTarjeta(value);

    if (res.length !== 1) {
        return Promise.reject('id card not exist or your status is false');
    }
}

async function isCreditCard(value: string) {
    const res = await TarjetasController.obtenerTarjeta(value);
    return res.length === 1 && res[0].tipo === 'credito';
}

const schema: Schema = {
    alias: {
        optional: true,
        isString: {
            errorMessage: 'Name isn`t string'
        },
        notEmpty: {
            errorMessage: 'Name can`t empty'
        },
    },
    numero: {
        optional: true,
        custom: {
            options: async (value, { req, location, path }) => {
                if (value) {
                    if(typeof value !== 'string') {
                        return Promise.reject('card number isn`t string');
                    }
                    else {
                        if (value.length < 13 || value.length > 16) {
                            return Promise.reject('The card number must be between 13 and 16 characters long.');
                        }
                        else {
                            if (TarjetaSchema.checkLuhn(value)) {
                                return Promise.reject('The card number is not valid.');
                            }
                            else {
                                const res = await TarjetaSchema.existCardNumber(value);
                                if (res.length > 0) {
                                    return Promise.reject('existing card number.');
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    fechaVencimiento: {
        optional: true,
        custom: {
            options: (value, { req, location, path }) => {
                if (value) {
                    if(typeof value !== 'string') {
                        return Promise.reject('due date isn`t string');
                    }
                    else {                        
                        if (!/^(0?[1-9]|1[012])\-(0?[1-9]|\d{2})$/.test(value)) {
                            return Promise.reject('The due date not have format mm-yy');
                        }

                        const digits = value.split('-');
                        const month = parseInt(digits[0]);
                        const year = parseInt(digits[1]);
                        if (!TarjetaSchema.isFutureDate(year, month)) {
                            return Promise.reject('The due date it is not a future date');
                        }

                        return true;
                    }
                }
            }
        }
    },


    montoLimite: {
        optional: true,
        custom: {
            options: async (value, { req, location, path }) => {
                if (value || value === 0) {
                    if(typeof value !== 'number') {
                        return Promise.reject('Limit amount isn`t number');
                    }
                    else {
                        if (value < 0) {
                            return Promise.reject('The limit amount cannot be less than zero');
                        }

                        if (!await isCreditCard(req.params!.idTarjeta)) {
                            return Promise.reject('The card isn`t credit');
                        }

                        return true;
                    }
                }
            }
        }
    },
    montoDisponible: {
        optional: true,
        custom: {
            options: async (value, { req, location, path }) => {
                if (value || value === 0) {
                    if(typeof value !== 'number') {
                        return Promise.reject('amount available isn`t number');
                    }
                    else {
                        if (value < 0) {
                            return Promise.reject('The amount available cannot be less than zero');
                        }

                        if (req.body.hasOwnProperty('montoLimite')) {
                            if (value > req.body.montoLimite) {
                                return Promise.reject('The amount available cannot be more than limit amount');
                            }
                        }
                        else {
                            const res = await TarjetaCredito.findOne({tarjeta: mongoose.Types.ObjectId(req.params!.idTarjeta)});

                            if (res && res.montoLimite < value) {
                                return Promise.reject('The amount available cannot be more than limit amount');
                            }
                        }

                        if (!await isCreditCard(req.params!.idTarjeta)) {
                            return Promise.reject('The card isn`t credit');
                        }

                        return true;
                    }
                }
            }
        }
    },
    codigo: {
        optional: true,
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

                        if (!await isCreditCard(req.params!.idTarjeta)) {
                            return Promise.reject('The card isn`t credit');
                        }
                    }
                }
            }
        }

    },
    peridoDeCorte: {
        optional: true,
        custom: {
            options: async (value, { req, location, path }) => {
                if (value) {
                    if(typeof value !== 'number') {
                        return Promise.reject('cut-off period isn`t number');
                    }
                    else {
                        if (value < 0) {
                            return Promise.reject('The cut-off period cannot be less than zero');
                        }

                        if (!await isCreditCard(req.params!.idTarjeta)) {
                            return Promise.reject('The card isn`t credit');
                        }
                    }
                }
            }
        }
    },
    diasExtraDeCorte: {
        optional: true,
        custom: {
            options: async (value, { req, location, path }) => {
                if (value) {
                    if(typeof value !== 'number') {
                        return Promise.reject('extra days of balance cut isn`t number');
                    }
                    else {
                        if (value < 0) {
                            return Promise.reject('The extra days of balance cutf cannot be less than zero');
                        }

                        if (!await isCreditCard(req.params!.idTarjeta)) {
                            return Promise.reject('The card isn`t credit');
                        }
                    }
                }
            }
        }
    },
    interes: {
        optional: true,
        custom: {
            options: async (value, { req, location, path }) => {
                if (value) {
                    if(typeof value !== 'number') {
                        return Promise.reject('interes isn`t number');
                    }
                    else {
                        if (value < 0) {
                            return Promise.reject('The interes cannot be less than zero');
                        }

                        if (!await isCreditCard(req.params!.idTarjeta)) {
                            return Promise.reject('The card isn`t credit');
                        }
                    }
                }
            }
        }
    },
    fechaAperturaMensual: {
        optional: true,
        custom: {
            options: async (value, { req, location, path }) => {
                if (value) {
                    if(typeof value !== 'string') {
                        return Promise.reject('monthly opening date isn`t string');
                    }
                    else {
                        if (!/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(value)) {
                            return Promise.reject('The monthly opening date not have format yyyy-mm-dd');
                        }

                        const date = new Date(Date.parse(value));
                        const year = date.getFullYear() % 1000;
                        if (!TarjetaSchema.isFutureDate(year, date.getMonth() + 1, date.getDate())) {
                            return Promise.reject('The monthly opening date it is not a future date');
                        }

                        if (!await isCreditCard(req.params!.idTarjeta)) {
                            return Promise.reject('The card isn`t credit');
                        }
                    }
                }
            }
        }
    },
}

export default { schema, isValidCard };