import groupService from '../services/groupService';
import httpStatus from 'http-status-codes';
import handleError from '../utils/errorHandler';
import logger from '../logger/logger';


const createGroup = async (req, res) => {
    try {
        const response = await groupService.createGroup(req.userId, req.body.group_name, req.body.admin)
        res.status(httpStatus.CREATED).json(response);
    } catch (err) {
        logger.error(err, 'Error in createGroup controller');
        handleError(err, res);
    }
}

const joinGroup = async (req, res) => {
    try {
        const response = await groupService.joinGroup(req.userId, req.body.group_name)
        res.status(httpStatus.CREATED).json(response);
    } catch (err) {
        logger.error(err, 'Error in joinGroup controller');
        handleError(err, res)
    }
}

const getGroupInfo = async (req, res) => {
    try {
        const response = await groupService.getGroupInfo(req.params.id)
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in getGroupInfo controller');
        handleError(err, res)
    }
}


export default {
    createGroup,
    joinGroup,
    getGroupInfo
}
