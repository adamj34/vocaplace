import express from 'express';
import { db, pgp } from "../db/connection/db.js";

const router = express.Router();

router.get('/', (req, res) => {
    const userId = req.userId;

    db.users.findById({id: userId})
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

router.get('/visit/:visitedUserId', (req, res) => {
    const userId = req.params.visitedUserId;
    console.log('in visit');
    db.tx(() => {
        db.users.findById({id: userId})
        .then((data) => {
            console.log(data)
            Promise.all([
                db.user_relationships.findFriends({id: userId}),
                db.users.findGroupsByUserId({id: userId})
            ])
            .then(([friends, groups]) => {
                Promise.all([
                    ...friends.map(friend => db.users.findById({id: friend.user_id})),
                    ...groups.map(group => db.groups.findById({id: group.group_id}))
                ])
                .then(allData => {
                    const friendsData = allData.slice(0, friends.length);
                    const groupsData = allData.slice(friends.length);
                    res.status(200).json({
                        success: true,
                        user: data,
                        friends: friendsData,
                        groups: groupsData
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
    })
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
            console.log(data);
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

router.patch('/points', (req, res) => {
    const userId = req.userId;
    const points = req.body.points;
    db.users.incrementPoints({id: userId, points})
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
});

router.get('/friends', (req, res) => {
    const userId = req.userId;
    db.user_relationships.findFriends({id: userId})
    .then((data) => {
        Promise.all(data.map(friend => db.users.findById({id: friend.friend_id})))
        .then((data) => {
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
});

export default router;
