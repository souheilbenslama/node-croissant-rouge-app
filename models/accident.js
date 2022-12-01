const mongoose = require('mongoose');

const AccidentSchema = mongoose.Schema({
    
    id_temoin: {
        type: String,
        required: true,
    },

    id_secouriste: {
        type: String,
        required: false,
    },
    cas:{
        type:String , 
        required : true 
    },
    description:{
        type:String 
    },
    needSecouriste:{
         type :Boolean ,
         default :false

    },
    localite:{
        type:String
    }
    ,
    address:{
        type:String,
        default:""
    },
    status: {
        type: String,
        required: true,
        default: "finished"
    },
    longitude: {
        type: Number,
    //    required: true,
    },
    latitude:{
        type: Number,
      //  required: true,
    }

}, { timestamps: true });

module.exports = Accident = mongoose.model('Accident', AccidentSchema);