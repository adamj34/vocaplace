import { decode } from 'jsonwebtoken';
import { userDataSchema } from '../validation/userIdAndUsernameValidation.js';
import logger from '../logger/logger';
import { Server } from 'socket.io';



const validateUserData = async (token) => {
    const decodedToken = decode(token);
    const userId = decodedToken.sub;
    const username = decodedToken.preferred_username; 

    try {
        await userDataSchema.validate({
            userId: userId,
            username: username,
        });
        return { userId, username };
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const initializeSocketServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000"
        }
    });

    io.on('connection', async (socket) => {
        try {
            const { userId, username } = await validateUserData(socket.handshake.auth.token);
            socket.join(userId);
            console.log(username, "connected to socket; socket id:", socket.id );

            socket.on('disconnect', () => {
                console.log(username, 'disconnected from socket');
            });

        } catch (e) {
            console.error(e)
            socket.disconnect(true)
        }
    });

    return io;
};

export default initializeSocketServer;