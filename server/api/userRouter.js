import express from 'express';
import { db, pgp } from "../db/connection/db.js";
import getUserId from './getUserIdMiddleware.js';

const router = express.Router();

// router.get('/', getUserId, (req, res), getUserId in all routes
const userId = '223e4567-e89b-12d3-a456-426614174005';

router.get('/', (req, res) => {
    // const userId = req.userId;
    
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
            db.users.add({id: userId})
            .then((data) => {
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
    // const userId = req.userId;
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

// router.delete('/delete', getUserId, (req, res) => {
//     const userId = req.userId;
//     db.users.delete({id: userId})
//         .then((data) => {
//             res.status(200).json({
//                 success: true,
//                 data
//             });
//         })
//         .catch((err) => {
//             res.status(500).json({
//                 success: false,
//                 err
//             });
//         });
// })

router.delete('/profilePicture', (req, res) => {  // body, query ???
    // const userId = req.userId;

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
