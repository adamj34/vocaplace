import express from 'express';
import { db, pgp } from "../db/connection/db.js";

const router = express.Router();

const relationship_state = {
    'PENDING_USER1_USER2': 'pending_user1_user2',
    'PENDING_USER2_USER1': 'pending_user2_user1',
    'FRIENDS': 'friends',
};
Object.freeze(relationship_state);


router.post('/request/friend/:id', (req, res) => {
    const userId = req.userId;
    const friendId = req.params.id;
    // adhere to the constraint that user1_id < user2_id
    if (userId === friendId) {
        return  res.status(400).json({
            success: false,
            err: 'Cannot add yourself as a friend'
        });
    } else {
        let users;
        if (userId < friendId) {
            users = {
                user1_id: userId,
                user2_id: friendId,
                relationship: relationship_state.PENDING_USER1_USER2
            };
        } else {
            users = {
                user1_id: friendId,
                user2_id: userId,
                relationship: relationship_state.PENDING_USER2_USER1
            };
        }

        db.user_relationships.checkRelationship(users)
        .then((data) => {
            // if relationship does not exist
            if (!data) {
                db.user_relationships.addFriend(users)
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
            } else {
                return res.status(400).json({
                    success: false,
                    err: 'You are already friends or have a pending request with this user'
                });
            }
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

router.patch('/accept/friend/:id', (req, res) => {
    const userId = req.userId;
    const friendId = req.params.id;
    let users;
    if (userId < friendId) {
        users = {user1_id: userId, user2_id: friendId};
    } else {
        users = {user1_id: friendId, user2_id: userId};
    }
    users.relationship = relationship_state.FRIENDS;
    if (userId === friendId) {
        return res.status(400).json({
            success: false,
            err: 'Cannot accept yourself as a friend'
        });
    }
    db.user_relationships.acceptFriend(users)
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

router.get('/check/user/:id', (req, res) => {
    const userId = req.userId;
    const friendId = req.params.id;
    if (userId === friendId) {
        return res.status(400).json({
            success: false,
            err: 'Cannot check relationship with yourself'
        });
    } else {
        let users;
        if (userId < friendId) {
            users = {user1_id: userId, user2_id: friendId};
        } else {
            users = {user1_id: friendId, user2_id: userId};
        }
        db.user_relationships.checkRelationship(users)
        .then((data) => {
            res.status(200).json({
                success: true,
                data
            });
        })
        .catch((err) => {
            console.error(err);
            if (err.code === pgp.errors.queryResultErrorCode.noData) {
                const data = users;
                data.relationship = null;
                res.status(200).json({
                    success: true,
                    data
                });
            } else {
                res.status(500).json({
                    success: false,
                    err
                });
            }
        });
    }
});

router.get('/pending', (req, res) => {
    const userId = req.userId;
    db.user_relationships.getPendingRequests({id : userId})
    .then((data) => {
        console.log(data)
        Promise.all(data.map(user => db.users.findById({id: user.user_id})))
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
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({
            success: false,
            err
        });
    });
});

router.delete('/friend/:id', (req, res) => {
    const userId = req.userId;
    const friendId = req.params.id;
    let users;
    if (userId < friendId) {
        users = {user1_id: userId, user2_id: friendId};
    } else {
        users = {user1_id: friendId, user2_id: userId};
    }
    db.user_relationships.deleteFriend(users)
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

export default router;
