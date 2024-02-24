import express from 'express';
import userController from '../controllers/userController.js';
import validate from '../validation/validateMiddleware.js';
import { updateUserSchema, updatePointsSchema, getVistedUserIdSchema } from '../validation/userValidation.js';

const router = express.Router();

router
    .get('/', userController.getUserData)
    .get('/friends', userController.getFriendsData)
    .get('/groups', userController.getGroupsData)
    .get('/visit/:visitedUserId', validate(getVistedUserIdSchema), userController.getVisitedUserData)
    .patch('/', validate(updateUserSchema), userController.updateUser)
    .patch('/points', validate(updatePointsSchema), userController.updatePoints)
    .delete('/', userController.deleteUser)
    .delete('/profilePicture', userController.deleteProfilePicture)


export default router;
