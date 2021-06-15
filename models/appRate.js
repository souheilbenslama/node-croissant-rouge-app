const mongoose = require('mongoose') ; 


const RateSchema= new mongoose.Schema({
    userId : {
        type : String , 
        required : true , 
    },
    value:{
        type:Number,
        required:true 
    }

},{timestamps:true}) ;

exports.Rate= mongoose.model('Rate', RateSchema);