import httpStatus from 'http-status-codes';
import notificationService from "../services/notificationService";
import logger from "../logger/logger";
import  handleError  from '../utils/errorHandler.js';


const getNotifications = async (req, res) => {
    try {
        const response = await notificationService.getNotifications(req.params.userId);
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in getNotifications controller');
        handleError(err, res);
    }
}


const deleteNotification = async (req, res) => {
    try {
        const response = await notificationService.deleteNotification(req.params.notificationId);
        res.status(httpStatus.OK).json(response);
    } catch (err) {
        logger.error(err, 'Error in deleteNotification controller');
        handleError(err, res);
    }
}

export default {
    getNotifications,
    deleteNotification
}