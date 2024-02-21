import express from 'express';
import groupController from '../controllers/groupController';

const router = express.Router();


router
    .post('/', groupController.createGroup)
    .post('/join', groupController.joinGroup)
    .get('/:id', groupController.getGroupInfo)

export default router;
