const express = require("express");
const bodyparser = require('body-parser');
const app = express();
app.use(bodyparser.json())
app.set("port", 3001);


app.listen(app.get("port"), () => {
    console.log(`Backend server running: http://localhost:${app.get("port")}/`)
});