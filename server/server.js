import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json( {limit: '10mb'} ));
app.use(cors());


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});