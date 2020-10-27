const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    // user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    user: {type: String, required: true, unique: true, index: true},
    balance: {type: Number, required: true, default: 0}
});

module.exports = mongoose.model('Account', schema);
