const Joi = require('joi');

const iduser = Joi.number().integer().id();
const name = Joi.string().min(3).max(50);
const surname = Joi.string().min(3).max(50);
const email = Joi.string().max(50);
const password = Joi.string().min(6).max(100);
const phone = Joi.string().max(20);
const role = Joi.number();

const readUserSchema = Joi.object({
    iduser: iduser.required()
});

const createUserSchema = Joi.object({
    name: name.required(),
    surname: surname.required(),
    email: email.required(),
    password: password.required(),
    phone: phone.required(),
    role: role.required()
}); 

module.exports = {
    readUserSchema,
    createUserSchema
}