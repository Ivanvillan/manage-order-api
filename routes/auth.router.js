const express = require('express');
const passport = require('passport');

const AuthService = require('./../services/auth.service');
const service = new AuthService();
const router = express.Router();

router.post('/',
    passport.authenticate('local', { session: false }, ),
    async (req, res, next) => {
        try {
            const user = req.user;
            res.json(service.token(user[0]))
        } catch (error) {
            next(error);
        }
    });
module.exports = router;