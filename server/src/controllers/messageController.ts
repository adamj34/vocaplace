import httpStatus from 'http-status-codes';
import messageService from "../services/messageService";
import logger from "../logger/logger";
import  handleError  from '../utils/errorHandler.js';



const addMessage = (io)=> async (req, res) => {
    try {
        const response = await messageService.addMessage(req.userId, io, req.body);
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in addMessage controller');
        handleError(err, res);
    }
}

const deleteMessage =(io)=> async (req, res) => {
    try {
        const response = await messageService.deleteMessage(req.params.id,io, req.userId);
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in deleteMessage controller');
        handleError(err, res);
    }
}

export default {
    addMessage,
    deleteMessage
}
    