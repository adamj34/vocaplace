import express from 'express';
import { db, pgp } from "../db/connection/db.js";

const router = express.Router();


router.post('/', (req, res) => {
    console.log(req.body);
    db.units.add(req.body)
    .then((data) => {
        res.status(201).json({
            success: true,
            data
        });
    })
    .catch((err) => {
        if (err.code === '23505') {
            return res.status(403).json({
                success: false,
                err: "Unit already exists"
            });
        }

        res.status(500).json({
            success: false,
            err
        });
    }); 
});

router.get('/progress', (req, res) => {
    const userId = req.userId;

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
    const userId = req.userId;
    const id = req.params.id;

    db.units.detailedUserProgress({user_id: userId, unit_id: id})
    .then((data) => {
        const retrieveIds = data.reduce((acc, curr) => {
            acc = {...acc, [curr.topic_id]: {
                topic: curr.topic,
                created_at: curr.created_at,
                questions: curr.questions,
            }};
            return acc;
        }, {});
        res.status(200).json({
            success: true,
            data: retrieveIds
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

router.get('/overview', (req, res) => {

    db.units.overview()
    .then((data) => {
        const retrieveIds = data.reduce((acc, curr) => {
            acc = {...acc, [curr.unit_id]: {
                unit: curr.unit,
                topics: curr.topics,
            }};
            return acc;
        }, {})
        res.status(200).json({
            success: true,
            data: retrieveIds
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
