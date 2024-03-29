const express = require('express');

const usersRouter = require('./users.router');
const authRouter = require('./auth.router');
const categoriesRouter = require('./categories.router');
const productsRouter = require('./products.router');
const areasRouter = require('./areas.router');
const providersRouter = require('./providers.router');
const ordersRouter = require('./orders.router');
const shipmentsRouter = require('./shipments.router');
const movementsRouter = require('./movements.router');


function apiRouter(app) {
    const router = express.Router();
    app.use('/api/', router);
    router.use('/users', usersRouter);
    router.use('/auth', authRouter);
    router.use('/categories', categoriesRouter);
    router.use('/products', productsRouter);
    router.use('/areas', areasRouter);
    router.use('/providers', providersRouter);
    router.use('/orders', ordersRouter);
    router.use('/order-detail', ordersRouter);
    router.use('/shipments', shipmentsRouter);
    router.use('/movements', movementsRouter);
}

module.exports = apiRouter;