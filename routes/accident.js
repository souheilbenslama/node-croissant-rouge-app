var express = require('express');
var router = express.Router();
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

        const accident = new Accident({
            id_temoin: id_temoin,
            location: location,
            protectionDesc: protectionDesc,
            hemorragieDesc: hemorragieDesc,
            respirationDesc: respirationDesc,
            conscienceDesc: conscienceDesc,
        });
  
         console.log(accident) ; 

    try {
       
        var result = await accident.save() ; 
        res.send(result);
        setTimeout(function(){
            accident.update({$set: {"status": "Finished"}});

        },3600000)

    } catch (ex) {
        res.send(ex);
    }

})







module.exports = router;    
