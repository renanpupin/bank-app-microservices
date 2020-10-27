require('dotenv').config();

const cote = require('cote');
const mongoose = require('mongoose');
const Account = require('./model.js');

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, function(err) {
    if (err){
        console.log("Mongoose Connect error", err);
        throw err;
    }
});

const PID = parseInt(Math.random()*100);

// Instantiate a new Publisher component.
// const depositPublisher = new cote.Publisher({
//     name: 'deposit publisher',
//     // namespace: 'rnd',
//     // key: 'account',
//     broadcasts: ['deposit-ok', 'deposit-err'],
// });

const accountService = new cote.Responder({
    name: 'account responder',
    // key: 'account',
});

accountService.on('get-accounts', async (req, cb) => {
    return await Account.find({});
});

accountService.on('get-account', async (req, cb) => {
    return await Account.findOne({_id: req.params.id});
});

accountService.on('create-account', async (req, cb) => {
    return await new Account({
        user: req.params.user
    }).save();
});

const transactionRequester = new cote.Requester({ name: 'transaction-requester' });

accountService.on('deposit', async (req, cb) => {
    // if(Math.random() > 0.3){
    //     depositPublisher.publish('deposit-ok', {id: req.params, process: PID});
    // }else{
    //     depositPublisher.publish('deposit-err', {id: req.params, process: PID});
    // }
    // // depositPublisher.publish('deposit-ok', {id: req.params, __room: req.room});

    await transactionRequester.send({type: "deposit", params: {userFrom: req.params.userFrom, userTo: req.params.userTo}});

    return true;
});

const transactionSubscriber = new cote.Subscriber({
    name: 'Transaction Subscriber',
    // namespace: 'rnd',
    // key: 'a certain key',
    subscribesTo: ['deposit-transaction-ok'],
});

transactionSubscriber.on('deposit-transaction-ok', (req) => {
    console.log('deposit-transaction-ok', req);
});
