const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    userid: {
        type: String,
        require: false,
    },
    socketId:{
        type:String , 
        default:"images/avatar.png"
    }
}, { timestamps: true });

exports.User = mongoose.model('User', UserSchema);