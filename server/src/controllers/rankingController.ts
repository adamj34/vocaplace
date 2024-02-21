import httpStatus from 'http-status-codes';
import handleError from '../utils/errorHandler';
import rankingService from '../services/rankingService';
import logger from '../logger/logger';
import { log } from 'console';


const getTopUsersRanking = async (_req, res) => {
    try {
        const response = await rankingService.getTopUsersRanking();
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in getTopUsersRanking controller');
        handleError(err, res)
    }
}

const getFriendsRanking = async (req, res) => {
    try {
        const response = await rankingService.getFriendsRanking(req.userId);
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in getFriendsRanking controller');
        handleError(err, res)
    }
}

export default {
    getTopUsersRanking,
    getFriendsRanking
}
