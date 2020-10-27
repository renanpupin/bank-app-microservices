const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    // user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    userFrom: {type: String, required: true},
    userTo: {type: String, required: true},
    amount: {type: Number, required: true}
});

module.exports = mongoose.model('Transaction', schema);
