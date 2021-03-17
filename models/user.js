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
module.exports = User = mongoose.model('User', UserSchema);
