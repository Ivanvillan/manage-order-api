const Joi = require('joi');

const iduser = Joi.number().integer().id();
const name = Joi.string().min(3).max(50);
const surname = Joi.string().min(3).max(50);
const role = Joi.number();
const phone = Joi.string().max(20);
const email = Joi.string().max(50);
const password = Joi.string().min(8).max(100);

const readUserSchema = Joi.object({
    iduser: iduser.required()
});

const createUserSchema = Joi.object({
    name: name.required(),
    surname: surname.required(),
    role: role.required(),
    phone: phone.required(),
    email: email.required(),
    password: password.required()
}); 

module.exports = {
    readUserSchema,
    createUserSchema
}