const Joi = require('joi');

const idarea = Joi.number().integer().id();
const generate = Joi.date();
const reception_date = Joi.date();
const work_start_date = Joi.date();
const agreed_delivery_date = Joi.date();
const state = Joi.number().integer();
const canceled = Joi.number().integer();
const iduser = Joi.number().integer();
const email = Joi.string();
const observations = Joi.string().min(0).max(255);

const idorder = Joi.number().integer().id();
const idproduct = Joi.number().integer().id();
const aggregate_date = Joi.date();
const original_quantity = Joi.number().integer();
const real_quantity = Joi.number().integer();
const excluded = Joi.number().integer();
const isnew = Joi.number().integer();
const lastProduct = Joi.boolean();

const createOrderSchema = Joi.object({
    idarea: idarea.required(),
    generate: generate.required(),
    reception_date: reception_date.required(),
    work_start_date: work_start_date.required(),
    agreed_delivery_date: agreed_delivery_date.required(),
    state: state.required(),
    canceled: canceled.required(),
    iduser: iduser.required(),
    email: email.required(),
    observations: observations
});

const createOrderDetailSchema = Joi.object({
    idorder: idorder.required(),
    idproduct: idproduct.required(),
    aggregate_date: aggregate_date.required(),
    original_quantity: original_quantity.required(),
    real_quantity: real_quantity.required(),
    excluded: excluded.required(),
    isnew: isnew.required(),
    lastProduct: lastProduct
});

module.exports = {
    createOrderSchema,
    createOrderDetailSchema
}