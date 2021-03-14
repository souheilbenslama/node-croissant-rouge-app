var express = require('express');
var router = express.Router();
const secouriste = require("../models/secouriste");
//updating rescuer's disponibility 
router.put(
    "/disponibility/:id",
    async (req, res) => {
        try{
        const {id} = req.params;
        let {isFree}=req.body;

        secouriste = await secouriste.findByIdAndUpdate({ _id: id },{$set: {isFree: isFree}});
        res.send(secouriste);
    }
       catch (ex) {
        res.send(ex);
}
}
module.exports = router;