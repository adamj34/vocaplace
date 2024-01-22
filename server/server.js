import express from "express";
import cors from "cors";
import morgan from "morgan";

import { db } from "./db/connection/db.js";
import getUserData from "./api/getUserDataMiddleware.js";
import testConnection from "./db/connection/testConnection.js";
import userRouter from "./api/userRouter.js";
import unitRouter from "./api/unitRouter.js";
import userRelationsRouter from "./api/userRelationsRouter.js";
import questionRouter from "./api/questionRouter.js";   
import topicRouter from "./api/topicRouter.js";
import groupRouter from "./api/groupRouter.js";

import keycloak from './Keycloak.js';

const app = express(); 

await testConnection(db); 
 
app.use(morgan(":method :url :status :response-time ms")); 

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:8080']
}))    



app.use(keycloak.middleware()); 
// app.use(keycloak.protect());
app.use(getUserData);
app.use('/user', userRouter);
app.use('/units', unitRouter);
app.use('/topics', topicRouter);
app.use('/relationships', userRelationsRouter);
app.use('/questions', questionRouter);
app.use('/groups', groupRouter);

const PORT = process.env.PORT || 8000; 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); 
}); 
