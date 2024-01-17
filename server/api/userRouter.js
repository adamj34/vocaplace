import express from 'express';
import { db, pgp } from "../db/connection/db.js";

const router = express.Router();

router.get('/', (req, res) => {
    const userId = req.userId;

    db.users.find({id: userId})
    .then((data) => {
        res.status(200).json({
            success: true,
            data
        });
    })
    .catch((err) => {
        console.error(err);
        // If no data is returned, add the user to the database
        if (err.code === pgp.errors.queryResultErrorCode.noData) {
            db.users.add({id: userId, username: req.username}) 
            .then((data) => {
                data.picture = null
                res.setHeader('Location', '/user/' + userId);
                res.status(201).json({
                    success: true,
                    data
                });
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    err
                });
            });
        } else {
            res.status(500).json({
                success: false,
                err
            });
        }
    });
});


router.patch('/', (req, res) => {  
    const userId = req.userId;
    req.body.id = userId;

    if ('picture' in req.body) {
    db.users.update(req.body)
        db.tx(async () => {
            await db.users.update(req.body);
            await db.profile_pictures.upsert({id: userId, picture: req.body.picture});
        })
        .then(() => {
            res.json({
                success: true,
                data: {id: userId}
            }).status(200);
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                err
            });
        });
    } else {
        db.users.update(req.body)
        .then((data) => {
            res.json({
                success: true,
                data
            }).status(200);
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                err
            });
        });
    }
})

router.delete('/', (req, res) => {
    const userId = req.userId;
    db.users.delete({id: userId})
        .then((data) => {
            res.status(200).json({
                success: true,
                data
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                err
            });
        });
})

router.delete('/profilePicture', (req, res) => {  
    const userId = req.userId;

    db.profile_pictures.delete({id: userId})
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
