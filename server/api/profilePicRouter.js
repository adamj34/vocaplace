import express from 'express';
import db  from "./db/connection/db.js";

const router = express.Router();

router.post('/update', (req, res) => {  // body, query ???
    db.profile_pictures.upsert(req.body)
        .then((data) => {
            res.json({
                success: true,
                data
            }).status(200);
        })
        .catch((err) => {
            res.json({
                success: false,
                err
            }).status(500);
        });
})

router.delete('/delete', (req, res) => {  // body, query ???
    db.profile_pictures.delete(req.query)
        .then((data) => {
            res.json({
                success: true,
                data
            }).status(200);
        })
        .catch((err) => {
            res.json({
                success: false,
                err
            }).status(500);
        });
})


export default router;
