const express = require('express');
const passport = require('passport');

const MovementsService = require('./../services/movements.service');

const validatorHandler = require('./../middlewares/validator.handler');

const { readMovementSchema, createMovementSchema } = require('./../schemas/movement.schema');

const { rolesChek } = require('./../middlewares/auth.handler');

const router = express.Router();
const service = new MovementsService();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const movement = await service.read();
            res.status(200).json(movement);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/:idmovement',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(readMovementSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.idmovement;
            const movement = await service.readByID(id);
            res.status(200).json(movement);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(createMovementSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const movement = await service.create(body);
            res.status(201).json(movement);
        } catch (error) {
            next(error);
        }

    }
);

// router.patch('/:idmovement',
//     passport.authenticate('jwt', { session: false }),
//     validatorHandler(readMovementSchema, 'params'),
//     async (req, res, next) => {
//         try {
//             const id = req.params.idmovement;
//             const body = req.body;
//             const movement = await service.update(id, body);
//             res.status(201).json(movement);
//         } catch (error) {
//             next(error);
//         }

//     }
// );

module.exports = router;