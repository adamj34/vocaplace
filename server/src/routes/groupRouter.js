import express from 'express';
import groupController from '../controllers/groupController';
import { createGroupSchema, joinGroupSchema, getGroupInfoSchema } from '../validation/groupValidation';
import validate from '../validation/validateMiddleware';

const router = express.Router();


router
    .post('/', validate(createGroupSchema), groupController.createGroup)
    .post('/join', validate(joinGroupSchema), groupController.joinGroup)
    .get('/:id', validate(getGroupInfoSchema), groupController.getGroupInfo)

export default router;
