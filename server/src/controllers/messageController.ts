import httpStatus from 'http-status-codes';
import messageService from "../services/messageService";
import logger from "../logger/logger";
import  handleError  from '../utils/errorHandler.js';

const getMessages = async (req, res) => {
    try {
        const response = await messageService.getMessages(req.params.userId);
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in getMessages controller');
        handleError(err, res);
    }
}

const addMessage = async (req, res) => {
    try {
        const response = await messageService.addMessage(req.userId, req.io, req.body);
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in addMessage controller');
        handleError(err, res);
    }
}

const deleteMessage = async (req, res) => {
    try {
        const response = await messageService.deleteMessage(req.params.notificationId);
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in deleteMessage controller');
        handleError(err, res);
    }
}

export default {
    getMessages,
    addMessage,
    deleteMessage
}
    