import express from 'express';
import { db, pgp } from "../db/connection/db.js";
import getUserId from './getUserIdMiddleware.js';

const router = express.Router();

// router.get('/getData', getUserId, (req, res), getUserId in all routes
const userId = '123e4567-e89b-12d3-a456-426614174001';

router.get('/progress', (req, res) => {
    // const userId = req.userId;

    db.units.generalUserProgress({id: userId})
    .then((data) => {
        const progressData = data.reduce((acc, curr) => {
            acc = {...acc, [curr.id]: {
                unit: curr.unit,
                completion_ratio: curr.completion_ratio,
                created_at: curr.created_at,
            }};
            return acc;
        }, {});
        res.status(200).json({
            success: true,
            data: progressData
        });
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({
            success: false,
            err
        });
    });
});

router.get('/progress/:id', (req, res) => {
    // const userId = req.userId;
    const id = req.params.id;

    db.units.detailedUserProgress({user_id: userId, unit_id: id})
    .then((data) => {
        res.status(200).json({
            success: true,
            data
        });
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({
            success: false,
            err
        });
    });
});


export default router;
