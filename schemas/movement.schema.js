const Joi = require('joi');

const idmovement = Joi.number().integer().id();
const idproduct = Joi.number().integer().id();
const idreference = Joi.string();
const quantity = Joi.number().integer();
const price = Joi.number();
const type = Joi.number().integer();
const email = Joi.string();

const readMovementSchema = Joi.object({
    idmovement: idmovement.required()
});

const createMovementSchema = Joi.object({
    idproduct: idproduct.required(),
    idreference: idreference.required(),
    quantity: quantity.required(),
    price: price,
    type: type.required(),
    email: email,
});

module.exports = {
    readMovementSchema,
    createMovementSchema
}