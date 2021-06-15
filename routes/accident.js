var express = require('express');
var router = express.Router();
var  app = require("../app") ;
const Accident= require("../models/accident");

var mongoose = require('mongoose');
const passport = require('passport');
const {Secouriste} = require('../models/Secouriste');
var MessageService = require('../services/message_service');


//get all the interventions in progress
//verified
router.get('/inprogress', async(req,res)=> {
     try{  const results = await Accident.find({"status" : "in progress"});
           res.send(results);} 
    catch (ex){ res.send(ex);}}
)

//get all 
//verified
router.get('/all', async(req,res)=> {
  try{  const results = await Accident.find();
        res.send(results);} 
 catch (ex){ res.send(ex);}}
)

//get all the interventions of a single secouriste
//verified
router.post('/Secouristeinter', async(req,res)=> {
  try{  const results = await Accident.find({id_secouriste:req.body.id});
        res.send(results);} 
 catch (ex){ res.send(ex);}}
)



//set the intervention's status to finished
//verified
router.put('/finished/' , async(req, res) => {
  console.log("ttt") ;
  const {id}=req.body;

    try{ const results = await Accident.findOneAndUpdate ({_id: id},{$set: {"status": "finished"}},{ new: true });
        res.send(results); } catch (ex){
        res.send(ex);
    }
})


//creating alerte and changing Accident's status to finished automatically after 1 hour
//verified and the update is working
// done with new schema of accident
router.post('/', async (req, res) => {   
  
    const {id_temoin,
        longitude,
        latitude,
        cas,
        description,
        needSecouriste,localite,address
         } = req.body ; 
         
        const accident = new Accident({
            id_temoin: id_temoin,
            longitude: (longitude!='null')?parseFloat(longitude) :null,
            latitude:(latitude!='null')? parseFloat(latitude):null,
            cas:cas,
            description:description,
            needSecouriste:needSecouriste,
            localite:localite,
            address:address,
           
        });
        if(accident.needSecouriste) {
          accident.status = "in progress" ;
        }
        
        console.log(accident.needSecouriste == false) ;
        console.log(accident.status);
         
    try {

        var result = await accident.save() ;  
        
        if((result.needSecouriste)&&((latitude!='null')&&(longitude!='null'))){

          Secouriste.find({isNormalUser:false,isFree:true})
          .sort({ name: -1 })
          .then((users) => {
            
            if(users.length!=0){
           
            // To test the route we are going to pass users[6] and try to find the closest users
            us= SerouristsFinder({latitude:latitude,longitude:longitude}, users) ;
            app.sendSecouristeAlerte(us,result) ;
            
            res.status(200).send(result);
            }else{
              res.status(200).send(result) ;
            }
          })
          .catch((err) => {
            console.log(err) ;
            res.status(500).send({
              message: err.message || "Error Occured",
            });
          });

        }else{
          res.status(200).send(result);
        }

        setTimeout(async function (){
            results = await Accident.findOneAndUpdate ({_id: result._id},{$set: {"status": "finished"}},{ new: true })
        },2*3600000)
    } catch(ex){ 
      
      console.log(ex) ;
      res.status(400).send(ex); }

})




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


// Updating  SecouristID
           router.put(
            "/acceptintervention",
            passport.authenticate("jwt", { session: false }),
            async (req, res) => {
              if (!req.body.accidentId) {
                res.status(400).send({
                  message: "required fields cannot be empty",
                });
              }else{
                var accident = await Accident.findOne({_id:req.body.accidentId}) ; 
                if(accident){

                  if(accident.id_secouriste != null){
                    res.status(401).send({
                      message: "un autre secouriste a déjà accepté",
                    }); 
                  }else{

                    var accidentId = req.body.accidentId ;
                    const filter = { _id: accidentId };
                    Accident.findOneAndUpdate(filter, {id_secouriste: req.user.id}, { new: true })
                      .then((user) => {
                        if (!user) {
                          return res.status(404).send({
                            message: "no accident found",
                          });
                        }
                        res.status(200).send(user);
                      })
                      .catch((err) => {
                        return res.status(404).send({
                          message: "error while updating the accident",
                        });
                      });
                  
                  }

                }
              }})
                




module.exports = router;    
