var express = require('express');
var router = express.Router();
const Chat= require("../models/chat");
var mongoose = require('mongoose');
const passport = require('passport');
//get all the interventions in progress
router.get('/inprogress', async(req,res)=> {
    try{
        const results = await Accident.find({"status" : "in progress"});
        res.send(results);
    }
    catch (ex){
        res.send(ex);
    }
}
)
//set the intervention's status to finished
router.put('/finished/:id' , async(req, res) => {
    const {id}=req.params;
    try{
        const Accident = await Accident.findbyIdAndUpdate ({_id: id},{$set: {"status": "finished"}});
        res.send(results);
    }
    catch (ex){
        res.send(ex);
    }
})
//creating alerte and changing Accident's status to finished automatically after 1 hour
router.post('/', async (req, res) => {
    
    const {id_temoin,
        location,
        protectionDesc,
        hemorragieDesc,
        respirationDesc,conscienceDesc } = req.body ; 
        const newId = new mongoose.mongo.ObjectId();
        const accident = new Accident({
            id:newId,
            id_temoin: id_temoin,
            location: location,
            protectionDesc: protectionDesc,
            hemorragieDesc: hemorragieDesc,
            respirationDesc: respirationDesc,
            conscienceDesc: conscienceDesc,
        });
        const chat = new Chat({
            userId: id_temoin,
            accidentId: newId,
        });
         console.log(accident) ; 

    try {
        var result = await accident.save() ; 
        var result2 = await chat.save() ; 
        res.send(result + ' ' + result2);
        setTimeout(function(){
            accident.update({$set: {"status": "Finished"}});
        },3600000)

    } catch (ex) {
        res.send(ex);
    }

})


           // Updating chat's SecouristID
           router.put(
            "/updateSecouriste",
            passport.authenticate("jwt", { session: false }),
            async (req, res) => {
              if (!req.body.accidentId) {
                res.status(400).send({
                  message: "required fields cannot be empty",
                });
              }
                var accidentId = req.body.accidentId ;
                const filter = { accidentId: accidentId };
                Chat.findOneAndUpdate(filter, {secouristeId: req.user.id}, { new: true })
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
                      message: "error while updating the chat",
                    });
                  });
              })




module.exports = router;    
