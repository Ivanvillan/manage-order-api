const express = require('express');
const passport = require('passport');

const ProvidersService = require('./../services/providers.service');

const validatorHandler = require('../middlewares/validator.handler');

const { readProviderSchema, createProviderSchema } = require('../schemas/provider.schema');

const { rolesChek } = require('../middlewares/auth.handler');

const router = express.Router();
const service = new ProvidersService();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const vendors = await service.read();
            res.status(200).json(vendors);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/:idprovider',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(readProviderSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.idprovider;
            const provider = await service.readByID(id);
            res.status(200).json(provider);
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
            const providers = await service.readByState(enabled);
            res.status(200).json(providers);
        } catch (error) {
            next(error)
        }
    }
);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(createProviderSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const provider = await service.create(body);
            res.status(201).json(provider);
        } catch (error) {
            next(error);
        }

    }
);

router.patch('/:idprovider',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(readProviderSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.idprovider;
            const body = req.body;
            const provider = await service.update(id, body);
            res.status(201).json(provider);
        } catch (error) {
            next(error);
        }

    }
);

router.delete('/:idprovider',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(readProviderSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.idprovider;
            const provider = await service.delete(id);
            res.status(200).json(provider);
        } catch (error) {
            next(error);
        }

    }
);

module.exports = router;