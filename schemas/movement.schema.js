const { any } = require('joi');
const Joi = require('joi');

const idmovement = Joi.number().integer().id();
const idproduct = Joi.number().integer().id();
const idreference = Joi.string() | Joi.number();
const datetime = Joi.string();
const type = Joi.number().integer();
const quantity = Joi.number().integer();
const price = Joi.number();
const email = Joi.string();
const lastMovement = Joi.boolean();

const readMovementSchema = Joi.object({
    idmovement: idmovement.required()
});

const createMovementSchema = Joi.object({
    idproduct: idproduct.required(),
    idreference: idreference,
    datetime: datetime.required(),
    type: type.required(),
    quantity: quantity.required(),
    price: price,
    email: email,
    lastMovement: lastMovement
});

module.exports = {
    readMovementSchema,
    createMovementSchema
}