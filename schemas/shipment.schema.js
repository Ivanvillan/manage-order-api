const Joi = require('joi');

const idshipment = Joi.number().integer().id();
const idorder = Joi.number().integer().id();
const idprovider = Joi.number().integer().id();
const send = Joi.string();
const result = Joi.number().integer();
const email = Joi.string();
const created_at = Joi.string();

const readShipmentSchema = Joi.object({
    idshipment: idshipment.required()
});

const createShipmentSchema = Joi.object({
    idorder: idorder.required(),
    idprovider: idprovider.required(),
    send: send.required(),
    result: result.required(),
    email: email.required(),
    created_at: created_at.required(),
});

module.exports = {
    readShipmentSchema,
    createShipmentSchema
}