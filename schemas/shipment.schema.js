const Joi = require('joi');

const idshipment = Joi.number().integer().id();
const idorder = Joi.number().integer().id();
const idprovider = Joi.number().integer().id();
const status = Joi.number().integer();
const email = Joi.string();

const readShipmentSchema = Joi.object({
    idshipment: idshipment.required()
});

const createShipmentSchema = Joi.object({
    idorder: idorder.required(),
    idprovider: idprovider.required(),
    status: status.required(),
    email: email.required(),
});

module.exports = {
    readShipmentSchema,
    createShipmentSchema
}