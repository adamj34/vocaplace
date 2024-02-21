import express from 'express';
import userController from '../controllers/userController';

const router = express.Router();


router.get('/', (req, res) => {
    userController.getUserData(req, res);
});

router.get('/visit/:visitedUserId', (req, res) => {
    userController.getVisitedUserData(req, res);
});

router.patch('/', (req, res) => {  
    userController.updateUser(req, res);
})

router.delete('/', (req, res) => {
    userController.deleteUser(req, res);
})

router.delete('/profilePicture', (req, res) => {  
    userController.deleteProfilePicture(req, res);
})

router.patch('/points', (req, res) => {
    userController.updatePoints(req, res);
});

router.get('/friends', (req, res) => {
    userController.getFriendsData(req, res);
});

router.get('/groups', (req, res) => {
    userController.getGroupsData(req, res);
});

export default router;
