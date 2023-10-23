import express from "express";
import cors from "cors";
import db from "./db_connection/db.js";
import testConnection from "./db_connection/testConnection.js";

const app = express();

await testConnection(db);

// try {
//     const createTableQuery = `
//         CREATE TABLE IF NOT EXISTS example_table (
//             id SERIAL PRIMARY KEY,
//             name VARCHAR(100),
//             email VARCHAR(100)
//         )
//     `;

//     await dbConnection.none(createTableQuery);
//     console.log("Table created successfully");
// } catch (error) {
//     console.error("Error creating table: ", error);
// }


app.use(express.json( {limit: '10mb'} ));
app.use(cors());


app.get("/", (req, res) => {
    res.send("Hello World!!!");
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});