const express = require('express');
const passport = require('passport');

const validatorHandler = require('./../middlewares/validator.handler');
const { readUserSchema, createUserSchema } = require('./../schemas/user.schema')
const { rolesChek } = require('./../middlewares/auth.handler')

const UsersService = require('../services/users.service');
const { enable, enabled } = require('express/lib/application');

const router = express.Router();
const service = new UsersService();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    rolesChek(1),
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

router.get('/state/:enabled',
    passport.authenticate('jwt', { session: false }),
    rolesChek(1),
    async (req, res, next) => {
        try {
            const enabled = req.params.enabled;
            const users = await service.readByState(enabled);
            res.status(200).json(users);
        } catch (error) {
            next(error)
        }
    });

router.get('/role/:role',
    passport.authenticate('jwt', { session: false }),
    rolesChek(1),
    async (req, res, next) => {
        try {
            const role = req.params.role;
            const users = await service.readByRole(role);
            res.status(200).json(users);
        } catch (error) {
            next(error)
        }
    });

router.post('/username/',
    passport.authenticate('jwt', { session: false }),
    rolesChek(1),
    async (req, res, next) => {
        try {
            const username = req.body;
            const users = await service.readByUsername(username);
            res.status(200).json(users);
        } catch (error) {
            next(error)
        }
    });

router.post('/',
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
    rolesChek(1),
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
    rolesChek(1),
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