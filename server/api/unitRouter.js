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
        console.error(err);
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
                unit_icon: curr.icon,
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
        console.log(data);
        // handle case where unit has no topics
        if (data.length === 1 && data[0].topic_id === null) {
            return res.status(200).json({
                success: true,
                unit: data[0].unit,
                data: []
            });
        }
        let unit;
        const retrieveIds = data.reduce((acc, curr) => {
            unit = curr.unit;
            acc = {...acc, [curr.topic_id]: {
                topic: curr.topic, 
                topic_icon: curr.icon,
                created_at: curr.created_at,
                completion_ratio: curr.completion_ratio,
            }};
            return acc;
        }, {});
        res.status(200).json({
            success: true,
            unit: unit,
            data: retrieveIds
        });
    })
    .catch((err) => {
        console.error(err);
        if (err.code === pgp.errors.queryResultErrorCode.noData) {
            return res.status(404).json({
                success: false,
                err: "Unit not found"
            });
        }
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
                unit_icon: curr.unit_icon,
                topics: curr.topics || [],
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
