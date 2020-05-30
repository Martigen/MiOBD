const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let HotelsAndHostels = new Schema({
   Type: {
      type: String
   },
   Name: {
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
   Scoress: {
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
}, {
   collection: 'HotelsAndHostels'
})

module.exports = mongoose.model('HotelsAndHostels', HotelsAndHostels)