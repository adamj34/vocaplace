import express from 'express';
import unitController from '../controllers/unitController';
import validate from '../validation/validateMiddleware.js';
import keycloak from '../Keycloak.js';
import { createUnitSchema, getDetailedUserProgressSchema } from '../validation/unitValidation.js';

const router = express.Router();

router
    .post('/', keycloak.protect('app-backend:admin'), validate(createUnitSchema), unitController.createUnit)
    .get('/progress', unitController.getGeneralUserProgress)
    .get('/progress/:id', validate(getDetailedUserProgressSchema), unitController.getDetailedUserProgress)
    .get('/overview', unitController.getUnitOverview);


export default router;
