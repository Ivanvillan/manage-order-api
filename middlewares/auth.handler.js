const boom = require('@hapi/boom');

//funcion para comprobar los roles autorizados en la ruta
function checkRoles(...roles) {
    return (req, res, next) => {
        // se requiere la información del token
        const user = req.user
        //se crea una condicion para comprobar si el rol enviado por parametro esta incluido en el token
        if (roles.includes(user.role)) {
            next();
        } else {
            next(boom.unauthorized());
        }
    }
}

module.exports = {
    checkRoles
}