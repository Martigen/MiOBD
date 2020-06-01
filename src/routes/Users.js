const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Users = new Schema({
    name: {
        type: String
    },
    surname: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: [{
        type: String
    }],
}, {
    collection: 'Users'
})

module.exports = mongoose.model('Users', Users)