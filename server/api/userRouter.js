import express from 'express';
import db  from "./db/connection/db.js";

const router = express.Router();

router.post('/signUp', (req, res) => {  // body, query ???
    db.users.add(req.body)
        .then((data) => {
            res.json({
                success: true,
                data
            }).status(201);
        })
        .catch((err) => {
            res.json({
                success: false,
                err
            }).status(500);
        });
})

router.patch('/update', (req, res) => {  // body, query ???
    db.users.update(req.query)
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
