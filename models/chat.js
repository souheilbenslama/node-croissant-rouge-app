const mongoose = require('mongoose') ; 


const chatSchema= new mongoose.Schema({
    secouristeId : {
        type : String , 
        required : true , 
    },
    userId : {
        type : String , 
        required : true , 
    },
    accidentId : {
        type:String , 
        required : true
    },
    messages:{
        type:[String]
    }

})


const Chat = mongoose.model("Chat",chatSchema) ; 

exports.Chat=Chat ; 