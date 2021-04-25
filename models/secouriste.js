const mongoose = require('mongoose');
const SecouristeSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,

    },
    lastname: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
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
    },
    isActivated: {
        type: Boolean,
        require: false,
        default: false
    },
    //disponibility
    isFree: {
        type: Boolean,
        require: false,
    },
    verificationCode: {
        type: String,
        require: false,
    },
    phone: {
        type: String,
        require: false,
    },
    isNormalUser:{
        type:Boolean,
        default:false
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

module.exports = Secouriste = mongoose.model('Secouriste', SecouristeSchema);