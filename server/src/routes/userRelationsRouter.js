import express from 'express';
import userRelationsController from '../controllers/userRelationsController';
import validate from '../validation/validateMiddleware.js';
import { friendRelationSchema } from '../validation/userRelationsValidation.js';


const userRelationsRouter = (io) => {
    const router = express.Router();


    router
        .get('/check/user/:id', validate(friendRelationSchema), userRelationsController.checkRelationship)
        .get('/pending', userRelationsController.checkPendingRequests)
        .post('/request/friend/:id', validate(friendRelationSchema), userRelationsController.sendFriendRequest(io))
        .patch('/accept/friend/:id', validate(friendRelationSchema), userRelationsController.acceptFriendRequest(io))
        .delete('/request/sent/friend/:id', validate(friendRelationSchema), userRelationsController.deleteSentFriendRequest(io))
        .delete('/request/received/friend/:id', validate(friendRelationSchema), userRelationsController.deleteReceivedFriendRequest)
        .delete('/friend/:id', validate(friendRelationSchema), userRelationsController.deleteFriend)

    return router;
}

export default userRelationsRouter;
