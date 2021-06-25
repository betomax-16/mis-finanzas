import mongoose from 'mongoose';
import  { Schema } from 'express-validator';
import Divisa, { IDivisa } from '../../models/Divisas/Divisa';

function existDivisa(idCuenta: string, codigoDivisa: string) {
    return Divisa.find({cuenta: mongoose.Types.ObjectId(idCuenta), codigo: codigoDivisa.toUpperCase()});
}

const schema: Schema = {
    nombre: {
        isString: {
            errorMessage: 'Name isn`t string'
        },
        notEmpty: {
            errorMessage: 'Name can`t empty'
        },
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
                        else {
                            const res = await existDivisa(req.params!.id, value.toUpperCase());
                            if (res) {
                                return Promise.reject('existing code.');
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
    monto: {
        custom: {
            options: (value, { req, location, path }) => {
                if (value || value === 0) {
                    if(typeof value !== 'number') {
                        return Promise.reject('Amount isn`t number');
                    }
                    else {
                        if (value < 0) {
                            return Promise.reject('Amount isn`t numeric or is lest that zero.');
                        }

                        return true;
                    }
                }
                else {
                    return Promise.reject('Amount can`t empty');
                }
            }
        }
    }
}

export default { schema, existDivisa };