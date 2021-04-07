const mongoose = require('mongoose');
const SecouristeSchema = mongoose.Schema({
    phone: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    cin: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    socketId:{
        type:String , 
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    address: {
        type: String,
        require: true,
        unique: true
    },
    
    certificat: {
        type: String,
        require: false,
    },
    age: {
        type: Number,
        require: false
    },
    yearsOfExperience: {
        type: Number,
        require: false
    },
    isAdmin: {
        type: Boolean,
        require: false,
        default: false
    },
    description: {
        type: String,
        require: false
    },
    isActivated: {
        type: Boolean,
        require: false,
        default: false
    },
    //disponibility
    isFree: {
        type: Boolean,
        require:false,
    },
    verificationCode: {
        type: String,
        require: false,
    },
}, { timestamps: true });

exports.Secouriste = mongoose.model('Secouriste', SecouristeSchema);
