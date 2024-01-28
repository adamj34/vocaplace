import express from 'express';
import { db, pgp } from "../db/connection/db.js";

const router = express.Router();

router.get('/top', (req, res) => {
    db.rankings.getTopUsers()
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
