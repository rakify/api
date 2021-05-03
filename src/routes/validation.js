const Joi = require('joi');


const postValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string()
            .allow(""),
        title: Joi.string()
            .allow(""),
        body: Joi.string()
            .min(10)
            .required()
    });
    return schema.validate(data);
}

const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string()
            .min(3).
        required(),
        email: Joi.string()
            .email()
            .allow(""),
        password: Joi.string()
            .min(3)
            .required()
    });
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string()
            .min(3).
        required(),
        password: Joi.string()
            .min(3)
            .required()
    });
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.postValidation = postValidation;