const Joi = require('joi');

const idarea = Joi.number().integer().id();
const detail = Joi.string().max(50);

const readAreaSchema = Joi.object({
    idarea: idarea.required()
});

const createAreaSchema = Joi.object({
    detail: detail.required(),
});

module.exports = {
    readAreaSchema,
    createAreaSchema
}