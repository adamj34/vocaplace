import express from 'express';
import groupController from '../controllers/groupController';
import { createGroupSchema, joinGroupSchema, deleteMemberSchema, updateMembershipSchema, updateGroupSchema, groupIdSchema, passAdminRightsSchema } from '../validation/groupValidation.js';
import validate from '../validation/validateMiddleware.js';
import upload from '../utils/multerUpload.js';

const router = express.Router();


router
    .get('/:id', validate(groupIdSchema), groupController.getGroupInfo)
    .post('/', upload.single('picture'), validate(createGroupSchema), groupController.createGroup)
    .post('/join', validate(joinGroupSchema), groupController.joinGroup)
    .delete('/picture/:id', validate(groupIdSchema), groupController.deleteGroupPicture)
    .delete('/membership/:id', validate(deleteMemberSchema), groupController.deleteMember)
    .delete('/:id', validate(groupIdSchema), groupController.deleteGroup)
    .patch('/membership/:id', validate(updateMembershipSchema), groupController.updateMembership)
    .patch('/admin/:id', validate(passAdminRightsSchema), groupController.passAdminRights)
    .patch('/:id', upload.single('picture'), validate(updateGroupSchema), groupController.updateGroup)

export default router;
