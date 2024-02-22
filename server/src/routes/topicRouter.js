import express from 'express';
import topicController from '../controllers/topicController';
import validate from '../validation/validateMiddleware';
import { createTopicSchema } from '../validation/topicValidation';

const router = express.Router();

router
    .post('/', validate(createTopicSchema), topicController.createTopic);

export default router;
