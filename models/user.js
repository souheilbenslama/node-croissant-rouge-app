const mongoose = require('mongoose') ; 


const userSchema=new mongoose.Schema({

   udid:{
       type: String ,
       required:true},

    socketId:{
        type:String , 
    }
})


const User = mongoose.model("User",userSchema) ; 

exports.User=User ; 
