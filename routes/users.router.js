const express = require('express');
const passport = require('passport');

const validatorHandler = require('./../middlewares/validator.handler');
const { readUserSchema, createUserSchema } = require('./../schemas/user.schema')

const UsersService = require('../services/users.service');

const router = express.Router();
const service = new UsersService();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const users = await service.read();
            res.status(200).json(users);
        } catch (error) {
            next(error)
        }
    });

router.get('/:iduser',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(readUserSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.iduser;
            const user = await service.readByID(id);
            res.status(200).json(user);
        } catch (error) {
            next(error)
        }
    });

router.post('/',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(createUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const createUser = await service.create(body);
            res.status(201).json(createUser);
        } catch (error) {
            next(error);
        }
    });

router.patch('/:iduser', 
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const id = req.params.iduser;
            const updates = req.body;
            const userUpdate = await service.update(id, updates);
            res.json(userUpdate);
        } catch (error) {
            next(error);
        }
    });

    router.delete('/:iduser', 
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const id = req.params.iduser;
            const userDelete = await service.delete(id);
            res.json(userDelete);
        } catch (error) {
            next(error);
        }
    });

module.exports = router;