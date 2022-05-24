const express = require('express');
const passport = require('passport');

const CategoriesService = require('./../services/categories.service');
const { createCategorySchema, readCategorySchema } = require('./../schemas/category.schema');
const validatorHandler = require('./../middlewares/validator.handler');

const { rolesChek } = require('./../middlewares/auth.handler');

const router = express.Router();
const service = new CategoriesService();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const categories = await service.read();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }

    }
);

router.get('/:idcategorie',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(readCategorySchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.idcategorie;
            const category = await service.readByID(id);
            res.status(200).json(category);
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
            const categories = await service.readByState(enabled);
            res.status(200).json(categories);
        } catch (error) {
            next(error)
        }
    }
);

router.post('/denomination/',
    passport.authenticate('jwt', { session: false }),
    rolesChek(1),
    async (req, res, next) => {
        try {
            const denomination = req.body;
            const categories = await service.readByDenomination(denomination);
            res.status(200).json(categories);
        } catch (error) {
            next(error)
        }
    }
);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(createCategorySchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const category = await service.create(body);
            res.status(201).json(category);
        } catch (error) {
            next(error);
        }

    }
);

router.patch('/:idcategorie',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const id = req.params.idcategorie;
            const body = req.body;
            const category = await service.update(id, body);
            res.status(201).json(category);
        } catch (error) {
            next(error);
        }

    }
);

router.delete('/:idcategorie',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(readCategorySchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.idcategorie;
            const category = await service.delete(id);
            res.status(200).json(category);
        } catch (error) {
            next(error);
        }

    }
);





module.exports = router;