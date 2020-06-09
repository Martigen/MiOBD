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
  Accepted: {
     type: Boolean
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
      type: [{
        Score: {
          type: Number
        },
        Name: {
          type: String
        },
        Surname: {
          type: String
        },
        Description: {
          type: String
        },
        Date: {
          type: String
        }
      }]
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
      },
      Visible: {
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
