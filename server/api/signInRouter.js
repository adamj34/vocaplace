import express from 'express';
import db  from "./db/connection/db.js";

const router = express.Router();

router.post('/createUser', (_req, res) => {
    db.questions.create()
        .then(() => {
            res.json({
                'success': true,
                'message': 'User added successfully'
            })
            .status(201);
        })
        .catch(err => {
            res.json({
                'success': false,
                'message': err.message
            })
            .status(400);
        });
});

export default router;