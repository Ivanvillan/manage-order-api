const Joi = require('joi');

const idproduct = Joi.number().integer().id();
const idcategorie = Joi.number().integer().id();
const description = Joi.string().max(100);
const stock = Joi.number().integer();
// const price = Joi.number();

const readProductSchema = Joi.object({
    idproduct: idproduct.required()
});

const createProductSchema = Joi.object({
    idcategorie: idcategorie.required(),
    description: description.required(),
    stock: stock.required()
});

module.exports = {
    readProductSchema,
    createProductSchema
}