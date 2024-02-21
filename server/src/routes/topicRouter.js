import express from 'express';
import topicController from '../controllers/topicController';

const router = express.Router();


router.post('/', (req, res) => {
    topicController.createTopic(req, res);
});

export default router;
