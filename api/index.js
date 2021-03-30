const express = require("express");
const { DEBUG } = require("./debug");
const result = require("dotenv").config();

if (result.error)
    DEBUG(result.error);

// console.log(result.parsed);
const app = express();

// const port = process.env.PORT || 3000;
const port = 3000;
//Routers come here

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
const codeRouter = require("./routers/code");
app.use(codeRouter);
const optionsRouter = require("./routers/options");
app.use(optionsRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
module.exports = port;