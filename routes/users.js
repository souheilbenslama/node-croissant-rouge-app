var express = require('express');
var router = express.Router();
// Authentification imports 
const passport = require('passport');
const jsonwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {Secouriste} = require('../models/Secouriste');
const myKey = require("../mysetup/myurl");
const { body, validationResult } = require('express-validator');
const utils = require('../utils/utils');
const constant = require('../utils/constant');
const SecouristeService = require('../services/Secouriste.service');
const { uuid } = require('uuidv4');
const {User} = require("../models/User");
/**
 * REGISTER Route (Ajout d'un secouriste) 
 */
 router.post("/signup", [
    // Secouristename must be an email
    body('email').isEmail(),
    // password must be at least 5 chars long
    body('password',
        "Password should be combination of one uppercase ," +
        " one lower case, " +
        " one digit and min 8 , " +
        "max 20 char long")
        .matches("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,20}$", "i")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const newSecouriste = new Secouriste({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        cin: req.body.cin,
        address:req.body.address,
        phone:req.body.phone,
        verificationCode: uuid()
    });
    await Secouriste.findOne({ email: newSecouriste.email })
        .then(async profile => {
            if (!profile) {
                bcrypt.hash(newSecouriste.password, saltRounds, async (err, hash) => {
                    if (err) {
                        console.log("Error is", err.message);
                    } else {
                        newSecouriste.password = hash;
                        await newSecouriste
                            .save()
                            .then(() => {
                                //utils.verificationEmail(newSecouriste.email, newSecouriste.verificationCode, newSecouriste._id);
                                return res.status(200).send({ response: `Secouriste Created Successfully, Welcome ${newSecouriste.name}` });
                            })
                            .catch(err => {
                                return res.status(400).send({ error: 'Cannot create Secouriste with such data !' });
                            });
                    }
                });
            } else {
                return res.status(404).send({ error: "Secouriste already exists..." });
            }
        })
        .catch(err => {
            console.log("Error is", err.message);
        });
});

/**
 * LOGIN Route
 */
 router.post("/login",
 async (req, res) => {
     var newSecouriste = {};
     newSecouriste.email = req.body.email;
     newSecouriste.password = req.body.password;

     await Secouriste.findOne({ email: newSecouriste.email })
         .then(profile => {
             if (!profile) {
                 res.status(404).send({ error: "Secouriste not exist" });
             } else {
                 if (!profile.isActivated) {
                     res.status(400).send({ error: "Account not activated" });
                 }
                 bcrypt.compare(
                     newSecouriste.password,
                     profile.password,
                     async (err, result) => {
                         if (err) {
                             console.log("Error is", err.message);
                         } else if (result === true) {
                             const payload = {
                                 id: profile.id,
                                 name: profile.name,
                                 email: profile.email,
                                 isAdmin: profile.isAdmin,
                             };
                             jsonwt.sign(
                                 payload,
                                 myKey.secret,
                                 { expiresIn: 3600 },
                                 (err, token) => {
                                     return res.json({
                                         Secouriste: payload,
                                         success: true,
                                         token: "Bearer " + token
                                     });
                                 }
                             );
                         } else {
                             return res.status(401).send({ error: "Secouriste Unauthorized Access" });
                         }
                     }
                 );
             }
         })
         .catch(err => {
             console.log("Error is ", err.message);
         });
 });

/**
 * GET SECOURISTE PROFILE
 */
 router.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const Secouriste = await SecouristeService.getSecouristeById(req.user.id);
            return res.status(200).send(Secouriste);  
        } catch (error) {
            return res.status(404).send({ error: 'Profile not found' });
        }
    }
);

/**
 * Adding a normal User
 */
 router.post(
  "/normalUser",
  async (req, res) => {
    if (!req.body.userid) {
      return res.status(400).send({
        message: "Required field Phone number can not be empty",
      });
    }
    us =await User.findOne({'userid':req.body.userid } ); 
    if(us){
    const user = new User({
      userid: req.body.userid,
    });
    user
      .save()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the User.",
        });
      });
    }else{
      res.status(404).send({
        message:  "user already exists",
      });
    }
  }
);


/**
 * Verify a user route
 */
router.post(
  "/VerifyUser/:id",
  async (req, res) => {
    Secouriste.findByIdAndUpdate(req.params.id, {isActivated: true})
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: "no user found",
          });
        }
        res.status(200).send(user);
      })
      .catch((err) => {
        return res.status(404).send({
          message: "error while updating the user",
        });
      });
    }
);






// The function to get the distance in KM using long and lat
deg2rad = (deg)=> {
  return deg * (Math.PI/180)
}
getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}
// The function to find the closest free secourists
SerouristsFinder=  (position ,users) => {
    var lat1 = parseFloat(position.latitude.toString());
    var lon1 = parseFloat(position.longitude.toString());
    us = [] ;
    for(i=0 ; i<users.length ; i++)
    {
      if(users[i].isFree){
      var lat2 = parseFloat(users[i].latitude.toString());
      var lon2 = parseFloat(users[i].longitude.toString());
      if(getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2)<=1) 
      {
        us.push(users[i]);
      }}
  }
  return us ;
}
// The function to test the route
findClosestSecourists = (req, res) => {
  Secouriste.find()
    .sort({ name: -1 })
    .then((users) => {
      // To test the route we are going to pass users[6] and try to find the closest users
      us= SerouristsFinder(users[6], users) ;
      console.log(us.length + " secourists are found ,the closest to  " + users[6].email + " is " + us[0].email + " and "+ us[1].email);
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error Occured",
      });
    });
};
// This route is for testing the function  findClosestSecourists
router.get("/test", findClosestSecourists);



module.exports = router;
