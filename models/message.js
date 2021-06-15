const mongoose = require('mongoose') ; 


const messageSchema= new mongoose.Schema({
  senderId:{
      type:String,
      required:true 
  },
  accidentId:{
      type:String,
      required:true
  },
  content:{
    type:String,
    required:true
  } ,
  date:{
  type:Date , 
  required:true}
})


module.exports = Message = mongoose.model('Message', messageSchema);