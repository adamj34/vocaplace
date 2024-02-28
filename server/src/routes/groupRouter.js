import express from 'express';
import groupController from '../controllers/groupController';
import { createGroupSchema, joinGroupSchema, getGroupInfoSchema, deleteMemberSchema, updateMembershipSchema, updateGroupSchema, deleteGroupPictureSchema } from '../validation/groupValidation.js';
import validate from '../validation/validateMiddleware.js';
import upload from '../utils/multerUpload.js';

const router = express.Router();


router
    .get('/:id', validate(getGroupInfoSchema), groupController.getGroupInfo)
    .post('/', upload.single('picture'), validate(createGroupSchema), groupController.createGroup)
    .post('/join', validate(joinGroupSchema), groupController.joinGroup)
    .delete('/picture/:id', validate(deleteGroupPictureSchema), groupController.deleteGroupPicture)
    .delete('/membership/:id', validate(deleteMemberSchema), groupController.deleteMember)
    .patch('/membership/:id', validate(updateMembershipSchema), groupController.updateMembership)
    .patch('/:id', upload.single('picture'), validate(updateGroupSchema), groupController.updateGroup)

export default router;
