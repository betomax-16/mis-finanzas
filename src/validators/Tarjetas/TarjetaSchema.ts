import  { Schema } from 'express-validator';
import Tarjeta, { ITarjeta } from '../../models/Tarjetas/Tarjeta';

function checkFieldsCreditCard(obj: any) {
    const propertiesNeed = Array<string>();
    const modelProperties = [
        'tarjeta',
        'montoLimite',
        'montoDisponible',
        'codigo',
        'peridoDeCorte',
        'diasExtraDeCorte',
        'interes',
        'fechaAperturaMensual'
    ];

    modelProperties.forEach(property => {
        if(property !== 'tarjeta' && property !== 'fechaAperturaMensual') {
            if (!obj.hasOwnProperty(property)) {
                propertiesNeed.push(property);
            }
        }
    });

    return { existAllProperties: propertiesNeed.length === 0, fields: propertiesNeed };
}

function checkExistAnyFieldCreditCard(obj: any) {
    const propertiesNeed = Array<string>();
    const modelProperties = [
        'tarjeta',
        'montoLimite',
        'montoDisponible',
        'codigo',
        'peridoDeCorte',
        'diasExtraDeCorte',
        'interes',
        'fechaAperturaMensual'
    ];

    for (let index = 0; index < modelProperties.length; index++) {
        if(modelProperties[index] !== 'tarjeta' && modelProperties[index] !== 'fechaAperturaMensual') {
            if (obj.hasOwnProperty(modelProperties[index])) {
                return true;
            }
        }
    }

    return false;
}

function isFutureDate(year: number, month: number, day: number = 1) {
    const now = new Date();
    const miles = Math.round(now.getFullYear() / 1000) * 1000;
    const date = new Date(year + miles, month, day, 0, 0, 0, 0);

    return date.getTime() > now.getTime();
}

function checkLuhn(cardNumber: string) {
    let total = 0;
    for (let index = 0; index < cardNumber.length; index++) {
        let digito = parseInt(cardNumber[index]);
        if (index % 2 == 0) {
            digito *= 2;
            if (digito > 9) {
                digito -= 9;
            }
        }

        total += digito;
    }

    return total % 10 !== 0;
}

function existCardNumber(cardNumber: string) {
    return Tarjeta.find({numero: cardNumber});
}

const schema: Schema = {
    alias: {
        isString: {
            errorMessage: 'Name isn`t string'
        },
        notEmpty: {
            errorMessage: 'Name can`t empty'
        },
    },
    numero: {
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
                            if (checkLuhn(value)) {
                                return Promise.reject('The card number is not valid.');
                            }
                            else {
                                const res = await existCardNumber(value);
                                if (res.length > 0) {
                                    return Promise.reject('existing card number.');
                                }
                            }
                        }
                    }
                }
                else {
                    return Promise.reject('card number can`t empty');
                }
            }
        }
    },
    fechaVencimiento: {
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
                        if (!isFutureDate(year, month)) {
                            return Promise.reject('The due date it is not a future date');
                        }

                        return true;
                    }
                }
                else {
                    return Promise.reject('due date can`t empty');
                }
            }
        }
    },


    montoLimite: {
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

                        return true;
                    }
                }
            }
        }
    },
    montoDisponible: {
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

                        if (value > req.body.montoLimite) {
                            return Promise.reject('The amount available cannot be more than limit amount');
                        }

                        return true;
                    }
                }
            }
        }
    },
    codigo: {
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
            }
        }

    },
    peridoDeCorte: {
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
                    }
                }
            }
        }
    },
    diasExtraDeCorte: {
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
                    }
                }
            }
        }
    },
    interes: {
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
                    }
                }
            }
        }
    },
    fechaAperturaMensual: {
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
                        if (!isFutureDate(year, date.getMonth() + 1, date.getDate())) {
                            return Promise.reject('The monthly opening date it is not a future date');
                        }
                    }
                }
            }
        }
    },
}

export default { schema, existCardNumber, isFutureDate, checkLuhn, checkFieldsCreditCard, checkExistAnyFieldCreditCard };