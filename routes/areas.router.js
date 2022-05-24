const express = require('express');
const passport = require('passport');

const AreasService = require('./../services/areas.service');

const validatorHandler = require('./../middlewares/validator.handler');

const { readAreaSchema, createAreaSchema } = require('./../schemas/area.schema');

const { rolesChek } = require('./../middlewares/auth.handler');

const router = express.Router();
const service = new AreasService();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const areas = await service.read();
            res.status(200).json(areas);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/:idarea',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(readAreaSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.idarea;
            const area = await service.readByID(id);
            res.status(200).json(area);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/state/:enabled',
    passport.authenticate('jwt', { session: false }),
    rolesChek(1),
    async (req, res, next) => {
        try {
            const enabled = req.params.enabled;
            const areas = await service.readByState(enabled);
            res.status(200).json(areas);
        } catch (error) {
            next(error)
        }
    }
);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(createAreaSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const area = await service.create(body);
            res.status(201).json(area);
        } catch (error) {
            next(error);
        }

    }
);

router.patch('/:idarea',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(readAreaSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.idarea;
            const body = req.body;
            const area = await service.update(id, body);
            res.status(201).json(area);
        } catch (error) {
            next(error);
        }

    }
);

router.delete('/:idarea',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(readAreaSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.idarea;
            const area = await service.delete(id);
            res.status(200).json(area);
        } catch (error) {
            next(error);
        }

    }
);

module.exports = router;