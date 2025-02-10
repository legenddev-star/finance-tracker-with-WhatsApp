const Joi = require('joi');

const userRegisterValidation = (data) => {
    const schema = Joi.object({
        fullName: Joi.string()
            .required()
            .min(3)
            .max(50)
            .label('name'),
        email: Joi.string()
            .email()
            .required()
            .label('email'),
        phone: Joi.number()
            .required()
            .min(1111111111)
            .max(99999999999999)
            .label('phone'),
        password: Joi.string()
            .min(8)
            .max(50)
            .required()
            .label('password'),
    })

    return schema.validate(data);
}


const userLoginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .label('email'),
        password: Joi.string()
            .min(8)
            .max(50)
            .required()
            .label('password'),
    })

    return schema.validate(data);
}

module.exports.userRegisterValidation = userRegisterValidation;
module.exports.userLoginValidation = userLoginValidation;