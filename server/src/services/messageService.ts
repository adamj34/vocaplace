import { Server as SocketIOServer } from 'socket.io';
import { db, pgp } from "../db/connection/db";
import { errorFactory } from "../utils/errorFactory.js";
import { group } from 'console';
import { io } from '../server';
import { pictureToSignedUrl } from "../cloud/cloudFrontClient"


const addMessage = async (userId: string, io: SocketIOServer,
    newMessage:{
        groupId: number,
        message: string
    }
) => {
    try {
        const member =  await db.groups.findMemberByGroupIdAndUserId({ user_id: userId, group_id: newMessage.groupId });
        if (!member || !member.accepted) {
            throw errorFactory('403', `User: ${userId} is not a member of group: ${newMessage.groupId}`);
        }

        const message = {
            userId: userId,
            groupId: newMessage.groupId,
            message: newMessage.message
        }

        const dbMessage = await db.messages.addMessage(message);
        const user =pictureToSignedUrl(await db.users.findById({ id: userId }));
        const messageWithUser = {
            ...dbMessage,
            picture: user.picture,
            username: user.username,
            admin: member.admin
        }
        
        await io.to(newMessage.groupId.toString()).emit('newMessage', messageWithUser);

        return {
            success: true,
            data: messageWithUser
        };
    } catch (error) {
        console.error("Error in addMessage:", error);
        return {
            success: false,
            error: "Failed to add message"
        };
    }
}

const deleteMessage = async (messageId: number,io:SocketIOServer , userId: string) => {
    try {
        
        console.log(messageId,"type",typeof(messageId));
        const message = await db.messages.findById({ id: messageId });
        
        if (!message) {
            throw errorFactory('404', `Message: ${messageId} not found`);
        }
        const groupData = await db.groups.findById({ id: message.group_id });
        

        const userDeleting = await db.groups.findMemberByGroupIdAndUserId({ user_id: userId, group_id: groupData.id });
        
        if (!userDeleting || (!userDeleting.admin && userDeleting.user_id !== message.user_id)) {
            throw errorFactory('403', `User: ${userId} is not allowed to delete message: ${messageId} in group: ${groupData.id}`);
        }
        
         
        
        
        
        await db.messages.deleteMessage({ id: messageId });
        io.to(groupData.id.toString()).emit('deleteMessage', messageId);

        return {
            success: true
        };
    } catch (error) {
        console.error("Error in deleteMessage:", error);
        return {
            success: false,
            error: "Failed to delete message"
        };
    }
}

export default {
    
    addMessage,
    deleteMessage
}