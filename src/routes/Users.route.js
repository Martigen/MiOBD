const express = require('express');
const app = express();
const UsersRoute = express.Router();

// Users model
let Users = require('./Users');

// Add Users
UsersRoute.route('/create').post((req, res, next) => {
  Users.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All Userss
UsersRoute.route('/').get((req, res) => {
  Users.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

//Get User By Email And Passowrd
UsersRoute.route('/EM').post((req, res) => {
  Users.find({email : req.body.email,password : req.body.password},(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Get single Users
UsersRoute.route('/read/:id').get((req, res) => {
  Users.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update Users
UsersRoute.route('/update/:id').put((req, res, next) => {
  Users.findByIdAndUpdate(req.params.id, {
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

// Delete Users
UsersRoute.route('/delete/:id').delete((req, res, next) => {
  Users.findOneAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})




module.exports = UsersRoute;