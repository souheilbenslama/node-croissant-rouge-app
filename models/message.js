const mongoose = require('mongoose') ; 


const messageSchema= new mongoose.Schema({
  senderId:{
      type:String,
      required:true 
  },
  chatId:{
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

const Message = mongoose.model("Message",messageSchema) ; 
exports.Message=Message ; 