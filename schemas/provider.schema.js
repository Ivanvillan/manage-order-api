const Joi = require('joi');

const idprovider = Joi.number().integer().id();
const business_name = Joi.string().max(100);
const phone = Joi.number().integer();
const email = Joi.string().max(50);
const additional_information = Joi.string().max(255);

const readProviderSchema = Joi.object({
    idprovider: idprovider.required()
});

const createProviderSchema = Joi.object({
    business_name: business_name.required(),
    phone: phone.required(),
    email: email.required(),
    additional_information: additional_information.required(),
});

module.exports = {
    readProviderSchema,
    createProviderSchema
}