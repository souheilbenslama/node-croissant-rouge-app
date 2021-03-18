var express = require('express');
	var router = express.Router();
  const {Secouriste} = require('../models/Secouriste');
  const passport = require('passport');
	//updating rescuer's disponibility 
	router.put(
	    "/disponibility",
      passport.authenticate("jwt", { session: false }),
	    async (req, res) => {
	        try{
	        const id = req.user.id;
	        let {isFree}=req.body;
	        secouriste = await Secouriste.findByIdAndUpdate({ _id: id },{$set: {isFree: isFree}});
	        res.send(secouriste);
	    }
	       catch (ex) {
	        res.send(ex);
	}
	})
    // Updating rescuer's location
    router.put(
	    "/location",
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
          if (!req.body.longitude || !req.body.latitude ) {
            res.status(400).send({
              message: "required fields cannot be empty",
            });
          }
	          var longitude = req.body.longitude ;
            var latitude = req.body.latitude ;
            Secouriste.findByIdAndUpdate(req.user.id, {longitude: longitude , latitude: latitude}, { new: true })
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
                  message: "error while updating the location",
                });
              });
          })
	module.exports = router;