import express from 'express';
import searchController from '../controllers/searchController';

const router = express.Router();


router.get('/', (req, res) => {
    searchController.searchGroupsAndUsers(req, res);
});

export default router;
