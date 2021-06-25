import  { Schema } from 'express-validator';
import DivisasController from '../../controllers/DivisasController';
import DivisaSchema from './DivisaSchema';

async function checkIdDivisa(value: string) {
    const res = await DivisasController.obtenerDivisa(value);

    if (!res) {
        return Promise.reject('id Divisa not exist');
    }
}

const schema: Schema = {
    nombre: {
        optional:true,
        isString: {
            errorMessage: 'Name isn`t string'
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
                        else {
                            const res = await DivisaSchema.existDivisa(req.params!.id, value.toUpperCase());
                            if (res) {
                                return Promise.reject('existing code.');
                            }
                        }
                    }
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
            }
        }
    }
}

export default { schema, checkIdDivisa };