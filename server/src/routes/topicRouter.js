import express from 'express';
import topicController from '../controllers/topicController';
import validate from '../validation/validateMiddleware.js';
import keycloak from '../Keycloak.js';
import { createTopicSchema } from '../validation/topicValidation.js';

const router = express.Router();

router
    .post('/', keycloak.protect('app-backend:admin'), validate(createTopicSchema), topicController.createTopic);

export default router;
