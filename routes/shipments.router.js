const express = require('express');
const passport = require('passport');

const ShipmentsService = require('./../services/shipments.service');

const validatorHandler = require('../middlewares/validator.handler');

const { readShipmentSchema, createShipmentSchema } = require('../schemas/shipment.schema');

const { rolesChek } = require('../middlewares/auth.handler');

const router = express.Router();
const service = new ShipmentsService();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const shipment = await service.read();
            res.status(200).json(shipment);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/:idshipment',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(readShipmentSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.idshipment;
            const shipment = await service.readByID(id);
            res.status(200).json(shipment);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(createShipmentSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const shipment = await service.create(body);
            res.status(201).json(shipment);
        } catch (error) {
            next(error);
        }

    }
);

router.patch('/:idshipment',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(readShipmentSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.idshipment;
            const body = req.body;
            const shipment = await service.update(id, body);
            res.status(201).json(shipment);
        } catch (error) {
            next(error);
        }

    }
);

module.exports = router;