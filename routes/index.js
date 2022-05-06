const express = require('express');

const usersRouter = require('./users.router');
const authRouter = require('./auth.router');
const categoriesRouter = require('./categories.router');

function apiRouter(app) {
    const router = express.Router();
    app.use('/api/', router);
    router.use('/users', usersRouter);
    router.use('/auth', authRouter);
    router.use('/categories', categoriesRouter);
}

module.exports = apiRouter;