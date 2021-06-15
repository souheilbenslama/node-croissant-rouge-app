var express = require('express');
var router = express.Router();
const Message= require("../models/message");

router.get('/',async (res,req)=>{

     var accidentId = req.body.accidentId; 

     try{
            var messages = await Message.find({accidentId:accidentId}).sort('date') ;

            if(messages){
                res.status(200).send(messages);
            }else{
                res.status(402).send("no messages found") ;
            }

     }


}); 