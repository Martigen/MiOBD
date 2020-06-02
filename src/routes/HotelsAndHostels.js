const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let HotelsAndHostels = new Schema({
   User: {
      type: String
   },
   Type: {
      type: String
   },
   Name: {
      type: String
   },
   Stars: {
      type: String
   },
   Region: {
      type: String
   },
   Address: {
      City: {
         type: String
      },
      Street: {
         type: String
      }
   },
   Scores: {
      type: [Number]
   },
   Rooms: [{
      Number: {
         type: Number
      },
      Size: {
         type: Number
      },
      NumberOfBeds: {
         type: Number
      },
      Price: {
         type: Number
      },
      Vip: {
         type: Boolean
      }
   }],
   Extras: [{
      type: String
   }],
   Images: [{
      type: String
   }],
   Views: {
      type: Number
   },
}, {
   collection: 'HotelsAndHostels'
})

module.exports = mongoose.model('HotelsAndHostels', HotelsAndHostels)