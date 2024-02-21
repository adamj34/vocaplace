import express from 'express';
import userRelationsController from '../controllers/userRelationsController';

const router = express.Router();


router.post('/request/friend/:id', (req, res) => {
    userRelationsController.sendFriendRequest(req, res);
});

router.patch('/accept/friend/:id', (req, res) => {
    userRelationsController.acceptFriendRequest(req, res);
});

router.get('/check/user/:id', (req, res) => {
    userRelationsController.checkRelationship(req, res);
});

router.get('/pending', (req, res) => {
    userRelationsController.checkPendingRequests(req, res);
});

router.delete('/friend/:id', (req, res) => {
    userRelationsController.deleteFriend(req, res);
});

export default router;
