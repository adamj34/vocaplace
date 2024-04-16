import { Server as SocketIOServer } from 'socket.io';
import { db, pgp } from "../db/connection/db";
import { errorFactory } from "../utils/errorFactory.js";
import { group } from 'console';


const getNotifications = async (userId: string) => {
    const notifications = await db.notifications.getNotifications({userId});
    
    const enhancedNotifications = await notifications.reduce(async (accPromise, notification) => {
        const acc = await accPromise;  
        let friendName = null;
        let groupName = null;

        if (notification.friend_id) {
            try {
                const friend = await db.users.findById({id: notification.friend_id});
                friendName = friend ? friend.username : null;
            } catch (error) {
                console.error("Failed to find friend by ID:", error);
            }
        }

        if (notification.group_id) {
            try {
                const group = await db.groups.findById({id: notification.group_id});
                groupName = group ? group.group_name : null;
            } catch (error) {
                console.error("Failed to find group by ID:", error);
            }
        }

        acc.push({
            ...notification,
            friend_name: friendName,
            group_name: groupName
        });

        return acc;
    }, Promise.resolve([]));

    return {
        success: true,
        data: enhancedNotifications
    };
}


const sendNotification = async (userId: string, io: SocketIOServer,
    newNotification:{
        friendId?:string,
        groupId?:number,
        notificationType: string

    }
) =>{
    let friendName = null;
    let groupName = null;

    if (newNotification.friendId) {
        try {
            const friend = await db.users.findById({id:newNotification.friendId});
            friendName = friend ? friend.username : null;
        } catch (error) {
            console.error("Failed to find friend by ID:", error);
        }
    }

    if (newNotification.groupId) {
        try {
            const group = await db.groups.findById({id:newNotification.groupId});
            groupName = group ? group.group_name : null;
        } catch (error) {
            console.error("Failed to find group by ID:", error);
        }
    }

    const notificationForDB = {
        userId: userId,
        senderId: newNotification.friendId,
        groupId: newNotification.groupId,
        type: newNotification.notificationType,
    };
    await db.notifications.addNotification(notificationForDB)

    const fullNotification = {
        ...notificationForDB,
        friend_name: friendName,
        group_name: groupName
    };
    
    await io.to(userId).emit("newNotification",fullNotification)

    return {
        success: true,
        notificationForDB
    }
}

export default{
    getNotifications,
    sendNotification
}

