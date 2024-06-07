import express from 'express'
import notificationsController from '../controllers/notificationsController'


const router = express.Router()

router
    .get('/:userId', notificationsController.getNotifications)
    .delete('/:notificationId', notificationsController.deleteNotification)
    .delete('/all/:userId', notificationsController.deleteAllNotifications)
    .patch('/:notificationId', notificationsController.markAsRead)
    .patch('/all/:userId', notificationsController.markAllAsRead)

    
export default router
