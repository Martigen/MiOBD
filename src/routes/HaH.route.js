const express = require('express');
const app = express();
const HaHRoute = express.Router();

// HaH model
let HaH = require('./HotelsAndHostels');

// Add HaH
HaHRoute.route('/create').post((req, res, next) => {
  HaH.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All HaHs
HaHRoute.route('/').get((req, res) => {
  HaH.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single HaH
HaHRoute.route('/read/:id').get((req, res) => {
  HaH.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update HaH
HaHRoute.route('/update/:id').put((req, res, next) => {
  HaH.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// Delete HaH
HaHRoute.route('/delete/:id').delete((req, res, next) => {
  HaH.findOneAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})




module.exports = HaHRoute;