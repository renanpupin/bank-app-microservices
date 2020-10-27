require('dotenv').config();

const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
let ioRedis = require('socket.io-redis');
const cote = require('cote');

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.join('room1');
});

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, PUT, DELETE');
    res.setHeader("Access-Control-Allow-Headers", 'Origin, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    next();
});

// app.use(express.static('public'));

app.get('/', function (req, res) {
    console.log(`${req.ip} requested end-user interface`);

    res.sendFile(__dirname + '/public/index.html');
});


// app.use('/', require("./src/routes"));

// const timeService = new cote.Responder({ name: 'time responder' });
//
// timeService.on('time', async (req, cb) => {
//     return new Date();
//     // cb(null, new Date());
// });


const accountRequester = new cote.Requester({ name: 'account-requester' });

app.get('/api', function(req, res){
    res.json("BankApp API Gateway.");
});

app.post('/api/accounts', async (req, res) => {
    console.log("/api/accounts req.body.user", req.body.user);
    let account = await accountRequester.send({type: "create-account", params: {user: req.body.user}});

    res.json({
        message: "Account created.",
        account
    });
});

app.get('/api/accounts', async (req, res) => {
    let accounts = await accountRequester.send({type: "get-accounts"});

    res.json({
        message: "Get accounts.",
        accounts
    });
});

app.get('/api/accounts/:id', async (req, res) => {
    // const start = new Date();
    // let time = await timeRequester.send({type: "time", params: req.query.params});
    // const end = new Date();
    // console.log("diff", end.getTime()-start.getTime());
    const id = req.params.id;
    console.log("get account id", id);
    if(!id){
        throw new Error("ID not provided.")
    }

    let account = await accountRequester.send({type: "get-account", params: {id}});
    if(!account){
        throw new Error("Account not found.");
    }

    res.json({
        message: "Get account",
        account
    });
});

app.post('/api/deposit', async (req, res) => {
    await accountRequester.send({type: "deposit", params: {userFrom: req.body.userFrom, userTo: req.body.userTo}});

    res.json({
        message: "Deposit ok.",
    });
});

server.listen(3000);

new cote.Sockend(io, {
    name: 'end-user sockend server',
    // key: "account"
});


module.exports = app;
