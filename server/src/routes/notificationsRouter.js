import express from 'express'
import notificationsController from '../controllers/notificationsController'


const router = express.Router()

router
    .get('/:userId', notificationsController.getNotifications)
    


export default router