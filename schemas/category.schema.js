const Joi = require('joi');

const idcategorie = Joi.number().integer().id();
const denomination = Joi.string().max(50);

const readCategorySchema = Joi.object({
    idcategorie: idcategorie.required()
});

const createCategorySchema = Joi.object({
    denomination: denomination.required()
});

module.exports = {
    readCategorySchema,
    createCategorySchema
}
