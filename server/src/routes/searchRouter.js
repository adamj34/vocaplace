import express from 'express';
import searchController from '../controllers/searchController';
import validate from '../validation/validateMiddleware';
import { searchGroupsAndUsersSchema } from '../validation/searchValidation';

const router = express.Router();


router
    .get('/', validate(searchGroupsAndUsersSchema), searchController.searchGroupsAndUsers);


export default router;
