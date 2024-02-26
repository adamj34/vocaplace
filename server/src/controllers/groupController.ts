import groupService from '../services/groupService';
import httpStatus from 'http-status-codes';
import handleError from '../utils/errorHandler.js';
import logger from '../logger/logger';


const createGroup = async (req, res) => {
    try {
        const response = await groupService.createGroup(req.userId, req.body.group_name, req.body.bio, req.body.picture)
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

const updateMembership = async (req, res) => {
    try {
        const response = await groupService.updateMembership(req.userId, req.body.user_id_to_update, +req.params.id)
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in acceptMember controller');
        handleError(err, res)
    }
}

const deleteMember = async (req, res) => {
    try {
        const response = await groupService.deleteMember(req.userId, req.body.user_id_to_delete, +req.params.id)
        res.status(httpStatus.NO_CONTENT).json(response);
    } catch (err) {
        logger.error(err, 'Error in deleteMember controller');
        handleError(err, res)
    }
}

const getGroupInfo = async (req, res) => {
    try {
        const response = await groupService.getGroupInfo(+req.params.id)
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in getGroupInfo controller');
        handleError(err, res)
    }
}


export default {
    createGroup,
    joinGroup,
    getGroupInfo,
    deleteMember,
    updateMembership
}
