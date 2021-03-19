var express = require('express');
const Accident = require('../models/accident');
var router = express.Router();



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

    } catch (ex) {
        res.send(ex);
    }

});

module.exports = router;