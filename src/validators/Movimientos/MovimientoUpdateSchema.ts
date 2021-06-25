import  { Schema } from 'express-validator';

const schema: Schema = {
    estado: {
        isBoolean: {
            errorMessage: 'State isn`t boolean'
        },
        notEmpty: {
            errorMessage: 'State can`t be empty'
        }
    }
}

export default { schema };