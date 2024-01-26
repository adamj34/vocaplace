import express from 'express';
import { db, pgp } from "../db/connection/db.js";

const router = express.Router();

router.get('/', (req, res) => {
    const searchPhrase = req.query.searchPhrase;

    db.users.searchByUsername({searchPhrase})
    .then((matchedUsers) => {
        db.groups.searchByGroupname({searchPhrase})
        .then((matchedGroups) => {
            res.status(200).json({
                success: true,
                data: {matchedUsers, matchedGroups}
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
