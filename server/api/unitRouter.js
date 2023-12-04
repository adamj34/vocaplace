import express from 'express';
import { db, pgp } from "../db/connection/db.js";
import getUserId from './getUserIdMiddleware.js';

const router = express.Router();

// router.get('/getData', getUserId, (req, res), getUserId in all routes
const userId = '123e4567-e89b-12d3-a456-426614174001';

router.get('/progress', (req, res) => {
    // const userId = req.userId;

    db.units.userProgress({id: userId})
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
