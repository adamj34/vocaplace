import express from 'express';
import { db, pgp } from "../db/connection/db.js";
import getUserId from './getUserIdMiddleware.js';

const router = express.Router();

// router.get('/getData', getUserId, (req, res), getUserId in all routes
const userId = '123e4567-e89b-12d3-a456-426614174008';

router.get('/getData', (req, res) => {
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
            if (err.code === pgp.errors.queryResultErrorCode.noData) {
                res.status(404).json({
                    success: false,
                    err: 'User not found'
                });
            } else {
                res.status(500).json({
                    success: false,
                    err: 'An error occurred on the server'
                });
            }
        });
})

router.post('/signUp', (req, res) => {  
    // const userId = req.userId;
    db.users.add({id: userId})
        .then((data) => {
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
})


router.patch('/update', (req, res) => {  
    // const userId = req.userId;
    req.body.id = userId;
    console.log(req.body);
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


export default router;
