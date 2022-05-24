const express = require('express');
const passport = require('passport');

const ProductsService = require('./../services/products.service');

const validatorHandler = require('./../middlewares/validator.handler');

const { readProductSchema, createProductSchema } = require('./../schemas/product.schema');

const { rolesChek } = require('./../middlewares/auth.handler');

const router = express.Router();
const service = new ProductsService();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const products = await service.read();
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/:idproduct',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(readProductSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.idproduct;
            const product = await service.readByID(id);
            res.status(200).json(product);
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
            const products = await service.readByState(enabled);
            res.status(200).json(products);
        } catch (error) {
            next(error)
        }
    }
);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(createProductSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const product = await service.create(body);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }

    }
);

router.patch('/:idproduct',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(readProductSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.idproduct;
            const body = req.body;
            const product = await service.update(id, body);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }

    }
);

router.delete('/:idproduct',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(readProductSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.idproduct;
            const product = await service.delete(id);
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }

    }
);

module.exports = router;