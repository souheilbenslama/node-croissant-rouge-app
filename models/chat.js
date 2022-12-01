const mongoose = require('mongoose') ; 


const chatSchema= new mongoose.Schema({
    secouristeId : {
        type : String , 
        required : false , 
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

},{timestamps:true})

module.exports = Chat = mongoose.model('Chat', chatSchema);