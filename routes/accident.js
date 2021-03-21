var express = require('express');
var router = express.Router();
const secouriste = require("../models/secouriste");
const Accident= require("../models/accident");

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
        const Accident = await Accident.findbyIdAndUpdate ({_id: id},{$set: {status: "finished"}});
        res.send(results);
    }
    catch (ex){
        res.send(ex);
    }
}
    )





module.exports = router;    