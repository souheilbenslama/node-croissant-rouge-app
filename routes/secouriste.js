var express = require('express');
	var router = express.Router();
  const Secouriste = require('../models/secouriste');
  const passport = require('passport');

	//updating rescuer's disponibility 
  // verified
	router.put(
	    "/disponibility",
      passport.authenticate("jwt", { session: false }),
	    async (req, res) => {
	        try{
	        const id = req.user.id;
	        let {isFree}=req.body;
          
	        secouriste = await Secouriste.findByIdAndUpdate({ _id: id },{$set: {isFree: isFree}},{ new: true });
	        
          res.send(secouriste);
	    }
	       catch (ex) {
	        res.send(ex);
	}
	})

    // Updating rescuer's location
    // verified working
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
             const secouriste = await  Secouriste.findByIdAndUpdate({ _id: req.user.id }, {$set: {longitude: longitude,latitude:latitude}}, { new: true })
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
          
  
        // Updating rescuer's SocketID
        //verified and working 
    router.put(
	    "/socket",
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
          if (!req.body.socketId ) {
            res.status(400).send({
              message: "required fields cannot be empty",
            });
          }
	          var socketId = req.body.socketId ;
            Secouriste.findByIdAndUpdate(req.user.id, {socketId: socketId}, { new: true })
              .then((user) => {
                if (!user) {
                  console.log("no user ") ;
                  return res.status(404).send({
                    message: "no user found",
                  });
                }else{
                  return res.status(200).send(user);
                }
              })
              .catch((err) => {
                console.log(err) ; 
                return res.status(404).send({
                  message: "error while updating the socketID",
                });
              });
          })
//////
router.put(
  "/rate",
  async (req, res) => {
      try{
      const id = req.body.id;
      let rating=req.body.rating;
      secouriste1= await Secouriste.findById({ _id: id });
      raters1 = secouriste1.raters + 1 ;
      sum = secouriste1.sumRatings + rating ;
      note1 = Math.round(sum/raters1) ;
      secouriste = await Secouriste.findByIdAndUpdate({ _id: id },{$set: {note: note1 , raters : raters1,sumRatings:sum }},{ new: true });
      res.send(secouriste);
  }
     catch (ex) {
      res.send(ex);
}
})

	module.exports = router;
