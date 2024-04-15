import { Server as SocketIOServer } from 'socket.io';
import { db, pgp } from "../db/connection/db";
import { errorFactory } from "../utils/errorFactory.js";
import { group } from 'console';

const sendNotification = async (userId: string, io: SocketIOServer,
    newNotification:{
        friendId?:string,
        groupId?:string,
        notificationType: string

    }
) =>{    

    console.log("group_id",newNotification.groupId);
    
    const notification = {
        addresseeId : userId,
        senderId : newNotification.friendId,
        groupId: newNotification.groupId,
        type: newNotification.notificationType

    } 

    await io.to(userId).emit("newNotification",{notification})
    
}

export default{
    sendNotification
}

