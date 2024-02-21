import express from 'express';
import rankingController from '../controllers/rankingController';

const router = express.Router();


router.get('/top', (req, res) => {
    rankingController.getTopUsersRanking(req, res);
});

router.get('/friends', (req, res) => {
    rankingController.getFriendsRanking(req, res);
});

export default router;
