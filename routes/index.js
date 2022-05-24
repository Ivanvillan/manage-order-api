const express = require('express');

const usersRouter = require('./users.router');
const authRouter = require('./auth.router');
const categoriesRouter = require('./categories.router');
const productsRouter = require('./products.router');
const areasRouter = require('./areas.router');
const providersRouter = require('./providers.router');

function apiRouter(app) {
    const router = express.Router();
    app.use('/api/', router);
    router.use('/users', usersRouter);
    router.use('/auth', authRouter);
    router.use('/categories', categoriesRouter);
    router.use('/products', productsRouter);
    router.use('/areas', areasRouter);
    router.use('/providers', providersRouter);
}

module.exports = apiRouter;