import express from 'express';
import { db, pgp } from "../db/connection/db.js";

const router = express.Router();

router.post('/', (req, res) => {
    // first find the unit id
    db.units.findUnitIdByName({unit: req.body.unit})
    .then((data) => {
        console.log(data);
        if (!data) { 
            return res.status(404).json({
                success: false,
                err: "Unit not found"
            });
        }

        const unitId = data.id;
        db.topics.add({topic: req.body.topic, unit_id: unitId, icon: req.body.icon})
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
                    err: "Topic already exists"
                });
            }

            res.status(500).json({
                success: false,
                err
            });
        });
    })
    .catch((err) => {
        res.status(500).json({
            success: false,
            err
        });
    });

});

export default router;
