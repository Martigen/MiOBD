const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Users = new Schema({
    Name: {
        type: String
    },
    Surname: {
        type: String
    },
    Email: {
        type: String
    },
    Passowrd: {
        type: String
    },
    role: [{
        type: String
    }],
}, {
    collection: 'Users'
})

module.exports = mongoose.model('Users', Users)