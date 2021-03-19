var express = require('express');
const Accident = require('../models/accident');
var router = express.Router();
router.post('/accident', async(req, res) => {
    try {
        console.log("etc..");

        const { id } = req.body;

        console.log("ça marche " + id);

        /*
        
    "location" : "test_location",
    "protectionDesc" : "test_protection",
    "hemorragieDesc" : "test_hemorragie",
    "conscienceDesc" : "test_conscience",
    "respirationDesc" : "test_protection"
         */
        console.log("....;;..;");
        const accident = new Accident({
            id_temoin: id_temoin,
            location: location,
            protectionDesc: protectionDesc,
            hemorragieDesc: hemorragieDesc,
            respirationDesc: respirationDesc,
            conscienceDesc: conscienceDesc,
        });
        console.log(accident);
        res.send(accident);
    } catch (ex) {
        res.send(ex);
    }

});
module.exports = router;