import express from 'express';
import groupController from '../controllers/groupController';
import messageController from '../controllers/messageController';
import { createGroupSchema, memberOperationsSchema, updateGroupSchema, groupIdSchema } from '../validation/groupValidation.js';
import validate from '../validation/validateMiddleware.js';
import upload from '../utils/multerUpload.js';



const groupRouter = (io) => {

const router = express.Router();

router
    .get('/:id', validate(groupIdSchema), groupController.getGroupInfo)
    .post('/', upload.single('picture'), validate(createGroupSchema), groupController.createGroup)
    .post('/join/:id', validate(groupIdSchema), groupController.joinGroup(io))
    .delete('/picture/:id', validate(groupIdSchema), groupController.deleteGroupPicture)
    .delete('/membership/:id/:userId', validate(memberOperationsSchema), groupController.deleteMember(io))
    .delete('/:id', validate(groupIdSchema), groupController.deleteGroup(io))
    .patch('/membership/:id/:userId', validate(memberOperationsSchema), groupController.updateMembership(io))
    .patch('/admin/:id/:userId', validate(memberOperationsSchema), groupController.passAdminRights(io))
    .patch('/:id', upload.single('picture'), validate(updateGroupSchema), groupController.updateGroup)
    // Messages
    .post('/message/:id', validate(groupIdSchema), messageController.addMessage(io))
    .delete('/message/:id', validate(groupIdSchema), messageController.deleteMessage(io))
return router;
}
export default groupRouter;
