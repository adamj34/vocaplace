import express from 'express';
import { db, pgp } from "../db/connection/db.js";
import getUserId from './getUserIdMiddleware.js';

const router = express.Router();

const relationship_state = {
    'PENDING_USER1_USER2': 'pending_user1_user2',
    'PENDING_USER2_USER1': 'pending_user2_user1',
    'FRIENDS': 'friends',
    'BLOCK_USER1_USER2': 'block_user1_user2',
    'BLOCK_USER2_USER1': 'block_user2_user1',
    'BLOCK_BOTH': 'block_both'
};
Object.freeze(relationship_state);

const userId = '223e4567-e89b-12d3-a456-426614174005';
router.post('request/friend/:id', (req, res) => {
    // const userId = req.userId;
    const friendId = req.params.id;
    // adhere to the constraint that user1_id < user2_id
    if (userId === friendId) {
        res.status(400).json({
            success: false,
            err: 'Cannot add yourself as a friend'
        });
    } else if (userId < friendId) {
        db.user_relationships.addFriend({
            user1_id: userId,
            user2_id: friendId,
            relationship: relationship_state.PENDING_USER1_USER2})
        .then((data) => {
            res.status(201).json({
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
    } else if (userId > friendId) {
        db.user_relationships.addFriend({
            user1_id: friendId,
            user2_id: userId,
            relationship: relationship_state.PENDING_USER2_USER1})
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
    }
});

router.patch('accept/friend/:id', (req, res) => {
    // const userId = req.userId;
    const friendId = req.params.id;
    db.user_relationships.acceptFriend({
        user1_id: friendId,
        user2_id: userId,
        relationship: relationship_state.FRIENDS})
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

router.get('check/user/:id', (req, res) => {
    // const userId = req.userId;
    const friendId = req.params.id;
    if (userId === friendId) {
        res.status(400).json({
            success: false,
            err: 'Cannot check relationship with yourself'
        });
    } else {
        db.user_relationships.checkRelationship({
            user1_id: userId,
            user2_id: friendId})
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
    }
});

router.post('block/friend/:id', (req, res) => {
    // const userId = req.userId;    
    const friendId = req.params.id;
    
});

export default router;
