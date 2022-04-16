const express = require('express');

const usersRouter = require('./users.router');
const authRouter = require('./auth.router');

function apiRouter(app) {
    const router = express.Router();
    app.use('/api/', router);
    router.use('/users', usersRouter);
    router.use('/auth', authRouter);
}

module.exports = apiRouter;