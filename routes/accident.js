var express = require('express');
var router = express.Router();
const Accident= require("../models/accident");

//verified
//get all the interventions in progress
router.get('/inprogress', async(req,res)=> {
     try{  const results = await Accident.find({"status" : "in progress"});
           res.send(results);} 
    catch (ex){ res.send(ex);}}
)


//set the intervention's status to finished
//verified
router.put('/finished/' , async(req, res) => {
    const {id}=req.query;
    try{ const results = await Accident.findOneAndUpdate ({_id: id},{$set: {"status": "finished"}},{ new: true });
        res.send(results); } catch (ex){
        res.send(ex);
    }
})


//creating alerte and changing Accident's status to finished automatically after 1 hour
//verified and the update is working
router.post('/', async (req, res) => {
    
    const {id_temoin,
        longitude,latitude,
        protectionDesc,
        hemorragieDesc,
        respirationDesc,conscienceDesc } = req.body ; 

        const accident = new Accident({
            id_temoin: id_temoin,
            longitude: longitude,latitude:latitude,
            protectionDesc: protectionDesc,
            hemorragieDesc: hemorragieDesc,
            respirationDesc: respirationDesc,
            conscienceDesc: conscienceDesc,
        });
  
         console.log(accident) ; 

    try {
        var result = await accident.save() ; 
        res.send(result);
        setTimeout(async function (){
            results = await Accident.findOneAndUpdate ({_id: accident._id},{$set: {"status": "finished"}},{ new: true })
        },3600000)
    } catch(ex){ res.send(ex); }

})

module.exports = router;    
