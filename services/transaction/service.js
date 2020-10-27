require('dotenv').config();

const cote = require('cote');
const mongoose = require('mongoose');
const Transaction = require('./model');

const PID = parseInt(Math.random()*100);

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, function(err) {
    if (err){
        console.log("Mongoose Connect error", err);
        throw err;
    }
});

// const randomSubscriber = new cote.Subscriber({
//     name: 'Random Subscriber',
//     // namespace: 'rnd',
//     // key: 'a certain key',
//     subscribesTo: ['randomUpdate'],
// });
//
// randomSubscriber.on('randomUpdate', (req) => {
//     console.log('notified of ', req);
// });

const transactionService = new cote.Responder({
    name: 'transaction responder',
    // key: 'account',
});

const transactionPublisher = new cote.Publisher({
    name: 'transaction publisher',
    // namespace: 'rnd',
    // key: 'account',
    broadcasts: ['deposit-transaction-ok'],
});

transactionService.on('deposit', async (req, cb) => {

    // let transaction = await new Transaction({
    //     userFrom: req.params.userFrom,
    //     userTo: req.params.userTo,
    //     amount: req.params.amount,
    // }).save();

    transactionPublisher.publish('deposit-transaction-ok', {});

    return true;
});
