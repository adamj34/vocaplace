import express from 'express';
import { db, pgp } from "../db/connection/db.js";

const router = express.Router();

router.post('/', (req, res) => {
    const userId = req.userId;

    db.groups.addGroup({group_name: req.body.group_name, bio: req.body.bio, picture: req.body.picture})
    .then((data) => {
        db.groups.addMember({group_id: data.id, user_id: userId, admin: true})
        .then((_data) => {
            res.setHeader('Location', '/groups/' + data.id);
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
    })
    .catch((err) => {
        console.error(err);
        if (err.code === '23505') {
            return res.status(403).json({
                success: false,
                err: "Group already exists"
            });
        }
        res.status(500).json({
            success: false,
            err
        });
    });
});

router.post('/join', (req, res) => {
    const userId = req.userId;

    db.groups.findGroupIdByName({group_name: req.body.group_name})
    .then((data) => {
        if (!data) {
            return res.status(404).json({
                success: false,
                err: "Group not found"
            });
        }
        db.groups.addMember({group_id: data.id, user_id: userId, admin: false})
        .then((_data) => {
            res.setHeader('Location', '/groups/' + data.id);
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
    })  
});

router.get('/:id', (req, res) => {
    const groupId = req.params.id;
    db.groups.findById({id: groupId})
    .then((data) => {
        if (!data) {
            return res.status(404).json({
                success: false,
                err: "Group not found"
            });
        }
        db.groups.findMembersByGroupId({id: groupId})
        .then((members) => {
            Promise.all(
                members.map(member => 
                    db.users.findById({id: member.user_id})
                    .then(userData => ({...userData, admin: member.admin}))
                )
            )
            .then((membersData) => {
                res.status(200).json({
                    success: true,
                    group: data,
                    members: membersData
                });
            })
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
