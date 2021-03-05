const mongoose = require('mongoose') ; 


const userSchema=new mongoose.Schema({

   imei:{
       type: String ,
       required:true}  
})


const User = mongoose.model("user",userSchema) ; 

exports.USer=user ; 