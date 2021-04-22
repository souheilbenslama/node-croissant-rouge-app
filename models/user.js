const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    userid: {
        type: String,
        require: false,
    },
    socketId:{
        type:String , 
        default:null
    }
}, { timestamps: true });

exports.User = mongoose.model('User', UserSchema);