import express from 'express';
import unitController from '../controllers/unitController';
import validate from '../validation/validateMiddleware';
import { createUnitSchema, getDetailedUserProgressSchema } from '../validation/unitValidation';

const router = express.Router();

router
    .post('/', validate(createUnitSchema), unitController.createUnit)
    .get('/progress', unitController.getGeneralUserProgress)
    .get('/progress/:id', validate(getDetailedUserProgressSchema), unitController.getDetailedUserProgress)
    .get('/overview', unitController.getUnitOverview);


export default router;
