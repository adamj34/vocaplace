import express from "express";
import cors from "cors";
import db  from "./db/connection/db.js";
import testConnection from "./db/connection/testConnection.js";

const app = express();

await testConnection(db);

app.use(express.json( {limit: '10mb'} ));
app.use(cors());

app.get("/", (_req, res) => {
    // db.one(`
    //     CREATE TABLE IF NOT EXISTS questions (
    //         id SERIAL PRIMARY KEY,
    //         question TEXT NOT NULL,
    //         possible_answers TEXT[] NOT NULL,
    //         answer TEXT NOT NULL,
    //         category TEXT NOT NULL,
    //         difficulty INTEGER NOT NULL
    //     );
    // `)
    db.question.create()
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.error(err)
        })
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});