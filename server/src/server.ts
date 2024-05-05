import express from "express";
import cors from "cors";
import PinoHttp from "pino-http";
import logger from "./logger/logger";
import http from 'http';

// database imports
import { db } from "./db/connection/db";
import getUserData from "./routes/getUserDataMiddleware.js";
import testConnection from "./db/connection/testConnection.js";
import userRouter from "./routes/userRouter.js";
import unitRouter from "./routes/unitRouter.js";
import userRelationsRouter from "./routes/userRelationsRouter.js";
import questionRouter from "./routes/questionRouter.js";
import topicRouter from "./routes/topicRouter.js";
import groupRouter from "./routes/groupRouter.js";
import searchRouter from "./routes/searchRouter.js";
import rankingRouter from "./routes/rankingRouter.js";
import notificationsRouter from "./routes/notificationsRouter.js";

import keycloak from './Keycloak.js';
import initializeSocketServer from './socket/socketInit'

const app = express();
const server = http.createServer(app);

const client_port = process.env.CLIENT_PORT || 3000;
const keycloak_port = process.env.KEYCLOAK_PORT || 8080;

await testConnection(db);

// server configuration
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    credentials: true,
    origin: [`http://localhost:${client_port}`, `http://localhost:${keycloak_port}`]
}))

// logger configuration
app.use(PinoHttp({
    logger,
    serializers: {
        req: req => ({
            method: req.method,
            url: req.url,
            query: req.query,
        }),
        res: res => ({ statusCode: res.statusCode })
    }
}));

const io = initializeSocketServer(server);

app.use(keycloak.middleware());
app.use(getUserData);
app.use('/search', searchRouter);
app.use('/user', userRouter);
app.use('/units', unitRouter);
app.use('/topics', topicRouter);
app.use('/relationships', userRelationsRouter(io));
app.use('/questions', questionRouter);
app.use('/groups', groupRouter(io));
app.use('/rankings', rankingRouter);
app.use('/notifications',notificationsRouter );


export {io}

const server_port = process.env.SERVER_PORT || 8000;
server.listen(server_port, () => {
    logger.info(`Server running on port ${server_port}`);
}); 
