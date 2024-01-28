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

router.get('/friends', (req, res) => {
    const userId = req.userId;
    db.user_relationships.findFriends({id: userId})
    .then((data) => {
        Promise.all(data.map(friend => db.users.findById({id: friend.friend_id})))
        .then((data) => {
            db.users.findById({id: userId})
            .then((user) => {
                data.push(user);
                data.sort((a, b) => b.points - a.points);
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
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                success: false,
                err
            });
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
