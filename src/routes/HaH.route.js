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

// Add Views HaH
HaHRoute.route('/view/:id').get((req, res, next) => {

  HaH.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
     data.Views +=1
     data.save();
     res.json(true)
    }
  })
})

// Get user Hotels And Hostels
HaHRoute.route('/user/:id').get((req, res, next) => {

  HaH.find({ User: req.params.id }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})



// Delete HaH
HaHRoute.route('/delete/:id').delete((req, res, next) => {
  HaH.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})


HaHRoute.route('/reserve').post((req, res, next) => {
  let error2 = false;
  HaH.findById(req.body.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      data.Rooms.forEach(element => {
        if(element.Number == req.body.roomid){
          element.Reservations.forEach(e => {
            if(e.From >= req.body.from && e.From <= req.body.to){
            error2 = true;
            return next({message: "This date is already reserved!"})
          }
            else if(e.To >= req.body.from && e.To <= req.body.to){
              error2 = true;
              return next({message: "This date is already reserved!"})
            }
          });
          if(!error2)
          element.Reservations.push({From: req.body.from,To:req.body.to, UserId: req.body.userId})
        }
      });
      if(!error2){
      data.save();
      res.json(data)
      }
    }
  })
 
});

HaHRoute.route('/reservations').post((req, res, next) => {
  HaH.findById(req.body.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      data.Rooms.forEach(element => {
        if(element.Number == req.body.roomid){
          res.json(element.Reservations)
        }
      });
 
      
    }
  })
 
});

module.exports = HaHRoute;
