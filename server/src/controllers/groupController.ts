import groupService from '../services/groupService';
import httpStatus from 'http-status-codes';
import handleError from '../utils/errorHandler.js';
import logger from '../logger/logger';
import { NotificationType } from '../db/sql/types/notificationType.js';
import notificationService from '../services/notificationService';


const createGroup = async (req, res) => {
    try {
        const response = await groupService.createGroup(req.userId, req.body.group_name, req.body.bio, req.body.picture)
        res.status(httpStatus.CREATED).json(response);
    } catch (err) {
        logger.error(err, 'Error in createGroup controller');
        handleError(err, res);
    }
}

const updateGroup = async (req, res) => {
    try {
        console.log(req.body)
        const response = await groupService.updateGroup(req.userId, +req.params.id, req.body)
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in updateGroup controller');
        handleError(err, res)
    }
}

const deleteGroup =(io) => async (req, res) => {
    try {
        const response = await groupService.deleteGroup(req.userId, +req.params.id,io)
        res.status(httpStatus.NO_CONTENT).json(response);
    } catch (err) {
        logger.error(err, 'Error in deleteGroup controller');
        handleError(err, res)
    }
}

const deleteGroupPicture =async (req, res) => {
    try {
        const response = await groupService.deleteGroupPicture(req.userId, +req.params.id)
        res.status(httpStatus.NO_CONTENT).json(response);
    } catch (err) {
        logger.error(err, 'Error in deleteGroupPicture controller');
        handleError(err, res)
    }
}

const joinGroup =(io) => async (req, res) => {
    try {
        
        const response = await groupService.joinGroup(req.userId, +req.params.id,io)
        res.status(httpStatus.CREATED).json(response);
    } catch (err) {
        logger.error(err, 'Error in joinGroup controller');
        handleError(err, res)
    }
}

const updateMembership = (io)=> async (req, res) => {
    try {
        const response = await groupService.updateMembership(req.userId, req.params.userId, +req.params.id,io)
        await notificationService.sendNotification(req.params.userId,io,   {groupId: +req.params.id,notification_type: NotificationType.GROUP_REQUEST_ACCEPTED})
        
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in acceptMember controller');
        handleError(err, res)
    }
}

const passAdminRights = (io) => async (req, res) => {
    try {
        const response = await groupService.passAdminRights(req.userId, req.params.userId, +req.params.id,io)
        await notificationService.sendNotification(req.params.userId,io,   {groupId: +req.params.id,notification_type: NotificationType.GROUP_ADMIN_RECEIVED})
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in passAdminRights controller');
        handleError(err, res)
    }
}

const deleteMember =(io) =>async (req, res) => {
    try {
        const response = await groupService.deleteMember(req.userId, req.params.userId, +req.params.id,io)
        res.status(httpStatus.NO_CONTENT).json(response);
    } catch (err) {
        logger.error(err, 'Error in deleteMember controller');
        handleError(err, res)
    }
}

const getGroupInfo = async (req, res) => {
    try {
        const userId = req.userId;
        const response = await groupService.getGroupInfo(+req.params.id, userId)
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in getGroupInfo controller');
        handleError(err, res)
    }
}


export default {
    createGroup,
    updateGroup,
    deleteGroup,
    deleteGroupPicture,
    joinGroup,
    getGroupInfo,
    deleteMember,
    updateMembership,
    passAdminRights
}
