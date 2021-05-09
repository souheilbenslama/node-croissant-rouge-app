const mongoose = require('mongoose');
const SecouristeSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,

    },
    gouvernorat: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },socketId:{
        type: String,
        require: false,
        default : null
    },
    email: {
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
    },cin: {
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
        default: false,
    },
    verificationCode: {
        type: String,
        require: false,
    },
    phone: {
        type: String,
        require: true,
    },longitude: {
        type: Number,
        default:null
    },
    latitude:{
        type: Number,
        default:null,
    }
    ,socketId:{
        type: String,
        require: false,
        default : null
    },

    isNormalUser:{
        type:Boolean,
        default:true
    },
    note:{
        type:Number,
        default:0
    },
    raters:{
        type:Number,
        default:0
    },
    sumRatings:{
        type:Number,
        default:0
    }
}, { timestamps: true });
exports.Secouriste = mongoose.model('Secouriste', SecouristeSchema);