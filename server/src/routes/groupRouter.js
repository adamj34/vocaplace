import express from 'express';
import groupController from '../controllers/groupController';
import { createGroupSchema, memberOperationsSchema, updateGroupSchema, groupIdSchema } from '../validation/groupValidation.js';
import validate from '../validation/validateMiddleware.js';
import upload from '../utils/multerUpload.js';



const groupRouter = (io) => {

const router = express.Router();

router
    .get('/:id', validate(groupIdSchema), groupController.getGroupInfo)
    .post('/', upload.single('picture'), validate(createGroupSchema), groupController.createGroup)
    .post('/join/:id', validate(groupIdSchema), groupController.joinGroup)
    .delete('/picture/:id', validate(groupIdSchema), groupController.deleteGroupPicture)
    .delete('/membership/:id/:userId', validate(memberOperationsSchema), groupController.deleteMember)
    .delete('/:id', validate(groupIdSchema), groupController.deleteGroup)
    .patch('/membership/:id/:userId', validate(memberOperationsSchema), groupController.updateMembership(io))
    .patch('/admin/:id/:userId', validate(memberOperationsSchema), groupController.passAdminRights(io))
    .patch('/:id', upload.single('picture'), validate(updateGroupSchema), groupController.updateGroup)
    // Messages
    .get('/messages/:id', validate(groupIdSchema), groupController.getGroupMessages)
    .post('/message/:id', validate(groupIdSchema), groupController.sendGroupMessage)
    .delete('/message/:id', validate(groupIdSchema), groupController.deleteGroupMessage)
return router;
}
export default groupRouter;
