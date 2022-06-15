const express = require('express');
const passport = require('passport');

const OrdersService = require('./../services/orders.service');

const validatorHandler = require('./../middlewares/validator.handler');

const { createOrderSchema, createOrderDetailSchema } = require('./../schemas/order.schema');

const { rolesChek } = require('./../middlewares/auth.handler');

const router = express.Router();
const service = new OrdersService();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const orders = await service.read();
            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/detail/:idorder',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const id = req.params.idorder;
            const orders = await service.readOrderDetailByID(id);
            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/:idorder',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const id = req.params.idorder;
            const order = await service.readByID(id);
            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/state/:state',
    passport.authenticate('jwt', { session: false }),
    rolesChek(1),
    async (req, res, next) => {
        try {
            const state = req.params.state;
            const orders = await service.readByState(state);
            res.status(200).json(orders);
        } catch (error) {
            next(error)
        }
    }
);

router.get('/state/:canceled',
    passport.authenticate('jwt', { session: false }),
    rolesChek(1),
    async (req, res, next) => {
        try {
            const canceled = req.params.canceled;
            const orders = await service.readByState(canceled);
            res.status(200).json(orders);
        } catch (error) {
            next(error)
        }
    }
);

router.get('/state/:finished',
    passport.authenticate('jwt', { session: false }),
    rolesChek(1),
    async (req, res, next) => {
        try {
            const finished = req.params.finished;
            const orders = await service.readByState(finished);
            res.status(200).json(orders);
        } catch (error) {
            next(error)
        }
    }
);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(createOrderSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const order = await service.create(body);
            res.status(201).json(order);
        } catch (error) {
            next(error);
        }

    }
);

router.post('/detail',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(createOrderDetailSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const orderDetail = await service.createOrderDetail(body);
            res.status(201).json(orderDetail);
        } catch (error) {
            next(error);
        }

    }
);

router.patch('/:idorder',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const id = req.params.idorder;
            const body = req.body;
            const order = await service.update(id, body);
            res.status(201).json(order);
        } catch (error) {
            next(error);
        }

    }
);

router.patch('/detail/:idorder',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const id = req.params.idorder;
            const body = req.body;
            const orderDetail = await service.updateOrderDetail(id, body);
            res.status(201).json(orderDetail);
        } catch (error) {
            next(error);
        }

    }
);

router.delete('/:idorder',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const id = req.params.idorder;
            const order = await service.delete(id);
            res.status(200).json(order);
        } catch (error) {
            next(error);
        }

    }
);

module.exports = router;