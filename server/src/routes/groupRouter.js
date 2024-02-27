import express from 'express';
import groupController from '../controllers/groupController';
import { createGroupSchema, joinGroupSchema, getGroupInfoSchema, deleteMemberSchema, updateMembershipSchema } from '../validation/groupValidation.js';
import validate from '../validation/validateMiddleware.js';
import upload from '../utils/multerUpload.js';

const router = express.Router();


router
    .post('/', upload.single('picture'), validate(createGroupSchema), groupController.createGroup)
    .post('/join', validate(joinGroupSchema), groupController.joinGroup)
    .get('/:id', validate(getGroupInfoSchema), groupController.getGroupInfo)
    .delete('/membership/:id', validate(deleteMemberSchema), groupController.deleteMember)
    .patch('/membership/:id', validate(updateMembershipSchema), groupController.updateMembership);

export default router;
