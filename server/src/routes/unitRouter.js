import express from 'express';
import unitController from '../controllers/unitController';

const router = express.Router();


router.post('/', (req, res) => {
    unitController.createUnit(req, res);
});

router.get('/progress', (req, res) => {
    unitController.getGeneralUserProgress(req, res);
});

router.get('/progress/:id', (req, res) => {
    unitController.getDetailedUserProgress(req, res);
});

router.get('/overview', (req, res) => {
    unitController.getUnitOverview(req, res);
});

export default router;
