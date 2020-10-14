const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require('path')
const checkAuth = require("./routes/auth");
const serveStatic = require('serve-static')

dotenv.config();

app.use(serveStatic(path.join(__dirname, 'dist')))

var port = process.env.PORT || 8000

app.set("port",port);

//Conntect to db
mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true, useUnifiedTopology: true },() => {
    console.log("coonected to database!");
});

//Middleware
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if ('OPTIONS' == req.method) {
       res.sendStatus(200);
     }
     else {
       next();
     }});

// Importing routes
const authRouter = require("./routes/auth");

// use middleware
app.use("/api/user",authRouter);

app.listen(port,() => {
    console.log("App listening on port: " + port);
});