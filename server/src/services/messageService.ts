import { Server as SocketIOServer } from 'socket.io';
import { db, pgp } from "../db/connection/db";
import { errorFactory } from "../utils/errorFactory.js";
import { group } from 'console';


const getMessages = async (groupId: string) => {
    const messages = await db.messages.getMessages({groupId});

    return {
        success: true,
        data: messages
    };

}

const addMessage = async (userId: string, io: SocketIOServer,
    newMessage:{
        groupId: string,
        message: string
    }
) =>{
    const message = {
        userId: userId,
        groupId: newMessage.groupId,
        message: newMessage.message
    }

    const dbMessage = await db.messages.addMessage(message);
    await io.to(newMessage.groupId).emit('SendGroupMessage', dbMessage);

    return {
        success: true,
        data: dbMessage
    };
}

const deleteMessage = async (messageId: string) => {
    await db.messages.deleteMessage({id: messageId});

    return {
        success: true
    };
}


export default {
    getMessages,
    addMessage,
    deleteMessage
}