var express = require('express');
var router = express.Router();


// Authentification imports 
const passport = require('passport');
const jsonwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {Secouriste} = require('../models/secouriste');
var app = require('../app');

const myKey = require("../mysetup/myurl");
const { body, validationResult } = require('express-validator');
const utils = require('../utils/utils');
const constant = require('../utils/constant');
const SecouristeService = require('../services/secouriste.service');
const { uuid } = require('uuidv4');
const User = require("../models/user");
const {Rate} = require("../models/appRate");
var ResetCode = require("../models/ResetCode");
// Batch Login 
const csvParser = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const multer2 = require('multer') ;
const csv = require('fast-csv');
const nodemailer = require('nodemailer') ;
var smtpTransport = require("nodemailer-smtp-transport");

const upload = multer({ dest: 'tmp/csv/' });


var storage = multer2.diskStorage({destination:'public/uploads/images/',
  filename: (req, file, cb) => {
      cb(null,Date.now()+"_"+file.originalname );
  }
});

var upload2 = multer2({ storage: storage ,limits:{fieldSize:1024*1024*1024*1024*3}});









// Create user function 
async function createUser(data) {
  const newSec = new Secouriste({
      name: data[0],
      password: data[1],
      email: data[2],
      cin: data[3],
      gouvernorat:data[4],
      verificationCode: uuid()
  });
  
  await Secouriste.findOne({ email: newSec.email })
      .then(async profile => {
          if (!profile) {
            console.log("///////////////////");
              bcrypt.hash(newSec.password, saltRounds, async(err, hash) => {
                  if (err) {
                      console.log("Error is", err.message);
                  } else {
                    console.log("///////////////////*");
                    newSec.password = hash;
                      await newSec
                          .save()
                          .then(() => {
                              //utils.verificationEmail(newSecouriste.email, newSecouriste.verificationCode, newSecouriste._id);
                              console.log('user added');
                          })
                          .catch(err => {
                            console.log('problem while adding the user');
                          });
                  }
              });
          } else {
            console.log('user already exists');
          }
      })
      .catch(err => {
          console.log("Error is", err.message);
      });
}




// The route to add secourists in batch 
router.post('/upload', upload.single('file'), function async (req, res) {
  const fileRows = [];
  console.log(req.file);
  // open uploaded file
  csv.parseFile(req.file.path)
    .on("data", function (data) {
      fileRows.push(data); // push each row
     createUser(data);
    })
    .on("end", function () {
      console.log(fileRows)
      res.send("done");
      //process "fileRows" and respond
    })
});





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
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }
    const newSecouriste = new Secouriste({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        cin: req.body.cin,
        age:req.body.age,
        gouvernorat:req.body.gouvernorat,
        phone:req.body.phone,
        isNormalUser:req.body.isNormalUser,
        verificationCode: uuid()
    });
    await Secouriste.findOne({ email: newSecouriste.email })
        .then(async profile => {
            if (!profile) {
                bcrypt.hash(newSecouriste.password, saltRounds, async(err, hash) => {
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
                              console.log(err);
                                return res.status(400).send({ error: 'Cannot create Secouriste with such data !'+err });
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



router.post("/update",passport.authenticate("jwt", { session: false }),upload2.single("photo"), [
  // Secouristename must be an email
  body('email').isEmail(),
  // password must be at least 5 chars long
  //body('password',
  //    "Password should be combination of one uppercase ," +
  //    " one lower case, " +
  //    " one digit and min 8 , " +
  //    "max 20 char long")
  //.matches("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,20}$", "i")

], async(req, res) => {
console.log(req.file);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
      return res.status(400).json({ errors: errors.array() });
  }
  
  await Secouriste.findOne({ email: req.body.email })
      .then(async profile => {
          if (!profile||(req.body.email==req.user.email)) {
            console.log(req.user.photo) ;
                        
                    const secouriste = await  Secouriste.findByIdAndUpdate({ _id: req.user.id },  { name: req.body.name,
                      email: req.body.email,
                      photo:(req.file)?"uploads/images/" + req.file.filename:req.user.photo,
                      cin: req.body.cin,
                      age:req.body.age,
                      gouvernorat:req.body.gouvernorat,
                      phone:req.body.phone,}, { new: true }).then((value) => {
                              //utils.verificationEmail(newSecouriste.email, newSecouriste.verificationCode, newSecouriste._id);
                              console.log(value) ; 
                              console.log(req.user);
                              const payload = {
                                id: value._id,
                                name: value.name,
                                email: value.email,
                                age:value.age,
                                photo:value.photo,
                                phone:value.phone,
                                cin:value.cin,
                                gouvernorat:value.gouvernorat,
                                isAdmin: value.isAdmin,
                                isActivated:value.isActivated,
                                isNormalUser:value.isNormalUser
                            };
                            jsonwt.sign(
                                payload,
                                myKey.secret,
                                (err, token) => {
                                    return res.status(200).json({
                                        Secouriste: payload,
                                        success: true,
                                        token: "Bearer " + token
                                    });
                                  })
                          })
                          .catch(err => {
                            console.log(err);
                              return res.status(400).send({ error: 'Cannot update Secouriste with such data !'+err });
                          });
          } else {
              return res.status(404).send({ error: "email already exists... try new one " });
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
    async(req, res) => {
        var newSecouriste = {};
        newSecouriste.email = req.body.email;
        newSecouriste.password = req.body.password;

        await Secouriste.findOne({ email: newSecouriste.email })
            .then(profile => {
                if (!profile) {
                    res.status(404).send({ error: "Secouriste not exist" });
                } else {
                   // if (!profile.isActivated) {
                   //     res.status(400).send({ error: "Account not activated" });
                   // }
                    bcrypt.compare(
                        newSecouriste.password,
                        profile.password,
                        async(err, result) => {
                            if (err) {
                                console.log("Error is", err.message);
                            } else if (result === true) {
                                const payload = {
                                    id: profile.id,
                                    name: profile.name,
                                    email: profile.email,
                                    age:profile.age,
                                    phone:profile.phone,
                                    cin:profile.cin,
                                    photo:profile.photo ,
                                    gouvernorat:profile.gouvernorat,
                                    isAdmin: profile.isAdmin,
                                    isActivated:profile.isActivated,
                                    isNormalUser:profile.isNormalUser
                                };
                                jsonwt.sign(
                                    payload,
                                    myKey.secret,
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


    /** foreget password route */

 router.post("/forget", function(req,res){
      Secouriste.findOne({email:req.body.email},function(err,user){
          if(err){
              err.message = "user not found";
              res.status(403).send(err) ;

          }else if(!user){
                  var error = new Error("mail not found!");
                  return res.status(401).send(error.message);
          }else{
              var transporter = nodemailer.createTransport(smtpTransport({
                  service:"Gmail",
                  auth: {
                      user: "croissantrougeapp@gmail.com",
                      pass: "croissantapp5"
                  },
                  tls: {
                      rejectUnauthorized: false
                  }
              }));
              var code = Math.floor(Math.random()*899999)+100000;
              var codeData = {
                  value:code,
                  owner:user.email
              };
              ResetCode.create(codeData,function(error){ 
                  if(error){
                      error.message="code not saved successfully!";
                      return next(error);
                  }
              });
              var mailOptions = {
                  from: "croissantrougeapp@gmail.com",
                  to: req.body.email,
                  subject: "Verification Code",
                  text:  "Vous recevez ceci parce que vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte. \n \n" +
                  "Veuillez coller ceci dans votre application pour terminer le processus: \n \n" + "Votre code est : "+code
              };
              transporter.sendMail(mailOptions, function(err, info){
                  if (err) {
                      err.message="mail not sent";
                      return res.status(407).send(err) ;
                  }else {
                      res.send("code sent");
                  }
              });
          }
      });
  })


/** verify code route */

router.post("/verification",function(req,res){

  ResetCode.findOne({value:req.body.code},function(err,code){
    if(!code){
  
      return res.status(400).send("Wrong code");
      }else{
        Secouriste.findOne({email:code.owner},function(err,profile){
              if(err){
                  err.message="user not found";
                  return res.status(400).send(err);
              }else{
                const payload = {
                  id: profile.id,
                  name: profile.name,
                  email: profile.email,
                  age:profile.age,
                  phone:profile.phone,
                  cin:profile.cin,
                  photo:profile.photo ,
                  gouvernorat:profile.gouvernorat,
                  isAdmin: profile.isAdmin,
                  isActivated:profile.isActivated,
                  isNormalUser:profile.isNormalUser
              };
              jsonwt.sign(
                  payload,
                  myKey.secret,
                  (err, token) => {
                      return res.json({
                          Secouriste: payload,
                          success: true,
                          token: "Bearer " + token
                      });
                
                    })
              }
          });
      }
  });
})

/** reset password route  */

router.post("/reset", passport.authenticate("jwt", { session: false }),[// password must be at least 5 chars long
body('password',
    "Password should be combination of one uppercase ," +
    " one lower case, " +
    " one digit and min 8 , " +
    "max 20 char long")
.matches("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,20}$", "i")
],function(req,res){
 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
      return res.status(400).json({ errors: errors.array() });
  }

  if(req.body.password !== req.body.confirmPassword){
      var err = new Error("Passwords do not match");
      return res.status(400).send(err.message);
  }
  Secouriste.findById(req.user._id , function(err, user){
      if(err){
          return next(err);
      }
      else{
        bcrypt.hash(req.body.password, saltRounds, async(err, hash) => {
          if (err) {
              console.log("Error is", err.message);
              res.status(409).send(err);
          } else {
          user.password=hash
          user.save(function(err){
              if(err){
                  return res.send(err);
              }else{
                  res.status(200).send("Password updated");
              }
          })
      }})
  }});
})




/**
 * GET SECOURISTE PROFILE
 * verified and need only some modifications in returned user attributes
 */
router.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    async(req, res) => {
        try {
            const profile = await SecouristeService.getSecouristeById(req.user.id);

            const payload = {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              age:profile.age,
              phone:profile.phone,
              photo:profile.photo,
              cin:profile.cin,
              gouvernorat:profile.gouvernorat,
              isAdmin: profile.isAdmin,
              isActivated:profile.isActivated,
              isNormalUser:profile.isNormalUser
          };
          jsonwt.sign(
              payload,
              myKey.secret,
              (err, token) => {
                  return res.status(200).json({
                      Secouriste: payload,
                      success: true,
                      token: "Bearer " + token
                  });
              }
          );
        } catch (error) {
                    console.log(error);
          return res.status(404).send({ error: 'Profile not found' });
        }
    }
);


/*get anonymous user id*/ 


router.post(
  "/anonyme", async(req, res) => {
      try {
          const profile = await User.findOne({userDeviceId:req.body.id}) ;
              if(profile){

                res.status(200).send(profile) ;
              }else{
                res.status(400).send("user not found") ;
              }
          
      } catch (error) {
         console.log(error);
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
    us =await User.findOne({'userDeviceId':req.body.userid } ); 
    
    if(!us){
    const user = new User({
      userDeviceId: req.body.userid,
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
      res.status(200).send(us);
    }}
);


/** rating app route */


router.post(
  "/Rate",
  async (req, res) => {
    try{

    var old= await  Rate.findOneAndDelete({userId:req.body.id}) ;
     console.log(old)  ;
      var rate = new Rate({userId:req.body.id,value: parseInt( req.body.value)}) ;
      result = await rate.save() ;
      if(result){
        res.status(200).send(result) ;
      }else{
        res.status(409).send("rate not created") ;
      }
    }catch(ex){
console.log(ex);
      res.status(407).send(ex) ;
    }
    
    
  });


/**
 * Verify a user route
 * verified
 */
router.post(
    "/VerifyUser",
    async(req, res) => {
        Secouriste.findByIdAndUpdate(req.query.id, {$set: { isActivated: true }},{ new: true })
            .then((user) => {
              console.log(user);
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


/** route to change a user activation */

router.put(
  "/activationUser", passport.authenticate("jwt", { session: false }),
  async(req, res) => {
      Secouriste.findByIdAndUpdate(req.body.id, {$set: { isActivated: req.body.activated }},{ new: true })
          .then((user) => {
            console.log(user);
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


/** route to create an admin  */
router.put(
  "/adminuser", passport.authenticate("jwt", { session: false }),
  async(req, res) => {
      Secouriste.findByIdAndUpdate(req.body.id, {$set: { isAdmin: req.body.admin }},{ new: true })
          .then((user) => {
            console.log(user);
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
      if((users[i].isFree)&&(users[i].latitude!=null)&&(users[i].longitude)){
        
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


  Secouriste.find({isNormalUser:false,isFree:true})
    .sort({ name: -1 })
    .then((users) => {
      console.log("^^^^^^^^^^^^^^^^");
      console.log() ;
      console.log("^^^^^^^^^^^^^^^^");
      // To test the route we are going to pass users[6] and try to find the closest users
      us= SerouristsFinder({latitude:req.body.latitude,longitude:req.body.longitude}, users) ;
      console.log(us) ;
      console.log(us.length + " secourists are found ,the closest to  " + users[0].email + " is " + us[0].email + " and "+ us[0].email);
      res.status(200).send(us);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error Occured",
      });
    });
};

// This route is for testing the function  findClosestSecourists
router.get("/test", findClosestSecourists);

// Getting all the secourists
//verified
router.get('/list', async (req,res)=> {
  try{
      const results = await Secouriste.find({isNormalUser:false});
      console.log("results = " + results);
      res.send(results);
  }
  catch (ex){
    console.log(ex);
      res.send(ex);
  }
}
)

    // Updating user's SocketID
    // verified
    router.put(
	    "/socket",
        async (req, res) => {
          if (!req.body.socketId  ) {
            res.status(400).send({
              message: "required fields cannot be empty",
            });
          }
	          var socketId = req.body.socketId ;
            User.findOneAndUpdate({userDeviceId:req.body.deviceId} , {socketId: socketId}, { new: true })
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
                  message: "error while updating the socketID",
                });
              });
          })


/**
 * Batch LOGIN Route
 */
 router.post("/batchLogin",
 async(req, res) => {
  fs.createReadStream(req.body.filepath)
  .on('error', () => {
      // handle error
  })

  .pipe(csvParser())
  .on('data', (row) => {
    console.log(row);
  })

  .on('end', () => {
      // handle end of CSV
  })

 });


          
module.exports = router;

