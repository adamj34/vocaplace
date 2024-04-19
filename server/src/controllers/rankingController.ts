import httpStatus from 'http-status-codes';
import rankingService from '../services/rankingService';
import handleError from '../utils/errorHandler.js';
import logger from '../logger/logger';


const getTopUsersRanking = async (_req, res) => {
    try {
        const response = await rankingService.getTopUsersRanking();
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in getTopUsersRanking controller');
        handleError(err, res)
    }
}

const getTopUsersRankingByStreak = async (_req, res) => {
    try {
        const response = await rankingService.getTopUsersRankingByStreak();
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in getTopUsersRankingByStreak controller');
        handleError(err, res)
    }
}

const getTopGroupsRanking = async (req, res) => {
    try {
        const response = await rankingService.getTopGroupsRanking();
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in getTopGroupsRanking controller');
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
    getFriendsRanking,
    getTopUsersRankingByStreak,
    getTopGroupsRanking
}
