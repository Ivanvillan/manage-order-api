const Joi = require('joi');

const idprovider = Joi.number().integer().id();
const business_name = Joi.string().max(100);
const email = Joi.string().max(50);
const phone = Joi.number().integer();
const additional_information = Joi.string().max(255);

const readProviderSchema = Joi.object({
    idprovider: idprovider.required()
});

const createProviderSchema = Joi.object({
    business_name: business_name.required(),
    email: email.required(),
    phone: phone.required(),
    additional_information: additional_information.required(),
});

module.exports = {
    readProviderSchema,
    createProviderSchema
}