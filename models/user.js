const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    userid: {
        type: String,
        require: false,
    },
    socketId:{
        type:String , 
    }
}, { timestamps: true });

exports.User = mongoose.model('User', UserSchema);