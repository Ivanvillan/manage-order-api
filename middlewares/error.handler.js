function boomErrorHandler (err, req, res, next) {
    // Acá la lógica es si el error es de tipo boom,
    // boom va a manejar toda la informacion del error
    // sino, en el next, ejecuta un error normal
    if(err.isBoom) {
        const { output } = err;
        res.status(output.statusCode).json(output.payload);
    }
    next(err);
}

module.exports = {
    boomErrorHandler
}