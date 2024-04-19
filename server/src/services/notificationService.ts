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
        notification_type: string

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
        notification_type: newNotification.notification_type,
    };
    const dbNotification= await db.notifications.addNotification(notificationForDB)
    console.log("dbNotification",dbNotification);
    

    const fullNotification = {
        ...dbNotification,
        friend_name: friendName,
        group_name: groupName
    };
    
    await io.to(userId).emit("newNotification",fullNotification)

    return {
        success: true,
        notificationForDB
    }
}

const deleteNotification = async (notificationId: string) => {
    try {
        await db.notifications.deleteNotification({id: notificationId});
        return {
            success: true
        };
    } catch (error) {
        console.error("Failed to delete notification:", error);
        return {
            success: false,
            error: errorFactory("Failed to delete notification", error)
        };
    }
}

const deleteAllNotifications = async (userId: string) => {
    try {
        await db.notifications.deleteAllNotifications({userId: userId});
        return {
            success: true
        };
    } catch (error) {
        console.error("Failed to delete all notifications:", error);
        return {
            success: false,
            error: errorFactory("Failed to delete all notifications", error)
        };
    }
}

const markAsRead = async (notificationId: string) => {
    try {
        await db.notifications.markAsRead({id: notificationId});
        return {
            success: true
        };
    } catch (error) {
        console.error("Failed to mark notification as read:", error);
        return {
            success: false,
            error: errorFactory("Failed to mark notification as read", error)
        };
    }
}

const markAllAsRead = async (userId: string) => {
    try {
        await db.notifications.markAllAsRead({userId: userId});
        return {
            success: true
        };
    } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
        return {
            success: false,
            error: errorFactory("Failed to mark all notifications as read", error)
        };
    }
}

const deleteSentFriendRequestNotification = async (userId: string, io: SocketIOServer, friendId: string) => {
    try {
    const notification = await db.notifications.getNotificationByFriendId({userId,friendId});
    console.log('deleteSentFriendRequestNotification',notification);
    await db.notifications.deleteNotification({id:notification.id});
    
    await io.to(userId).emit("deleteNotification",notification.id);

    return {
        success: true
    };
} catch (error) {
    console.error("Failed to delete sent friend request notification:", error);
    return {
        success: false,
        error: errorFactory("Failed to delete sent friend request notification", error)
    };
}
}



export default{
    getNotifications,
    sendNotification,
    deleteNotification,
    deleteAllNotifications,
    markAsRead,
    markAllAsRead,
    deleteSentFriendRequestNotification
}

