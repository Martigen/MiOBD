const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let HotelsAndHostels = new Schema({
    type: {
        type: String
     },
   name: {
      type: String
   },
   address: [{
       city:{
        type: String
     }, 
      street:{
        type: String
     }  
   }],
   scoress: {
      type: [Number]
   },
   rooms: [{
    number:{
     type: Number
  }, 
   size:{
     type: Number
  },
  numberOfBeds:{
    type: Number
 },
 price:{
    type: Number
 },
 vip:{
    type: Boolean
 }     
}],
   extras: [{
      type: String
   }],
}, {
   collection: 'HotelsAndHostels'
})

module.exports = mongoose.model('HotelsAndHostels', HotelsAndHostels)