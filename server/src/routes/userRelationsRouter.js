import express from 'express';
import userRelationsController from '../controllers/userRelationsController';
import validate from '../validation/validateMiddleware';
import { friendRelationSchema } from '../validation/userRelationsValidation';

const router = express.Router();


router
    .get('/check/user/:id', validate(friendRelationSchema), userRelationsController.checkRelationship)
    .get('/pending', userRelationsController.checkPendingRequests)
    .post('/request/friend/:id', validate(friendRelationSchema), userRelationsController.sendFriendRequest)
    .patch('/accept/friend/:id', validate(friendRelationSchema), userRelationsController.acceptFriendRequest)
    .delete('/friend/:id', validate(friendRelationSchema), userRelationsController.deleteFriend);


export default router;
