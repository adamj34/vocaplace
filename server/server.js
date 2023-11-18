import express from "express";
import cors from "cors";
import session from 'express-session';
import Keycloak from 'keycloak-connect';
import morgan from "morgan";
import db from "./db/connection/db.js";
import testConnection from "./db/connection/testConnection.js";

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
app.use(cors());

// app.get('/test', keycloak.protect(), function (req, res) {
//     res.render(
//         'test',
//         { title: 'Testing keycloak on the server' }
//     );
// });

// app.use(keycloak.middleware({ logout: '/' }));

app.get("/", (_req, res) => {
    db.questions.create()
        .then(() => {
            res.json({
                'success': true,
                'message': 'Questions table created successfully'
            });
        })
        .catch(err => {
            res.json({
                'success': false,
                'message': err.message
            });
        });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
