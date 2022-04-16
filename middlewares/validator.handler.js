const boom = require('@hapi/boom');

// Esto es un closure
function validatorHandler(schema, property) {
    //middleware de forma dinamica para cada schema
    // y propiedades que reciba la peticion
    return (req, res, next) => {
        // validate viene de Joi que se encuentra en el
        // schema
        const data = req[property];
        const { error } = schema.validate(data, { abortEarly: false });
        if(error) {
            next(boom.badRequest(error));
        }
        next();
    }
}

module.exports = validatorHandler;