import express from 'express'
import notificationsController from '../controllers/notificationsController'


const router = express.Router()

router
    .get('/:userId', notificationsController.getNotifications)
    .delete('/:notificationId', notificationsController.deleteNotification)
    .delete('/:userId', notificationsController.deleteAllNotifications)
    


export default router