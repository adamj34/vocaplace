import express from "express";
import cors from "cors";
import db  from "./db/connection/db.js";
import testConnection from "./db/connection/testConnection.js";

const app = express();
 
await testConnection(db);

app.use(express.json( {limit: '10mb'} ));
app.use(cors());

app.get("/", (_req, res) => {
    db.questions.create()
        .then(() => {
            res.json({
                'success': true,
                'message': 'Questions table created successfully'
            })
        })
        .catch(err => {
            res.json({
                'success': false,
                'message': err.message
            })
        })
});
  

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});