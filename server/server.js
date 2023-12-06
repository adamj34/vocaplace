import express from "express";
import cors from "cors";
import session from 'express-session';
import Keycloak from 'keycloak-connect';
import morgan from "morgan";

import { db } from "./db/connection/db.js";
import testConnection from "./db/connection/testConnection.js";
import userRouter from "./api/userRouter.js";
import unitRouter from "./api/unitRouter.js";
import userRelationsRouter from "./api/userRelationsRouter.js";
import questionRouter from "./api/questionRouter.js";   

const app = express(); 

await testConnection(db); 

const memoryStore = new session.MemoryStore(); 
const keycloak = new Keycloak({ store: memoryStore }, './keycloak.json'); // Specify the path to your keycloak.json file
 
// Session
// app.use(session({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: true,
//     store: memoryStore
// }));  
 
app.use(morgan(":method :url :status :response-time ms"));
// app.use(keycloak.middleware());  
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.get('/test', keycloak.protect(), function (req, res) {
//     res.render(
//         'test',
//         { title: 'Testing keycloak on the server' }
//     );
// });

// app.use(keycloak.middleware({ logout: '/' }));

app.use('/user', userRouter);
app.use('/units', unitRouter);
app.use('/relationships', userRelationsRouter);
app.use('/questions', questionRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});   
 