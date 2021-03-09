const Message = require('../models/Message') ; 
const Chat = require('../models/chat')  ; 
const Secouriste = require('../models/secouriste') ; 
const User = require('../models/user')
async function sendMessage(data){s

    const message = new Message({senderId:data.id,chatId:chat,content:data.message,time:data.time}) ; 

    try{
        const result = await Message.save(message) ;
    }catch(e){
        console.log(e); 
    }
}

async function getRecieverSocketId(data){
    const chatId=data.chatId ;
    const senderId= data.Id ; 
    try{
        const chat = await Chat.findById(chatId) ;
        
        if(chat.secouristeId==senderId){

            try{
            const secouriste= await Secouriste.findById(SecouristeId) ; 
            return secouriste.socketId ; 
            }

            catch(e){
                console.log(e) ; 
            }
        }else{
        try{
            const reciever= await User.findById(senderId) ; 
            return reciever.socketId ; 
        }catch(e){
             console.log(e) ; 
        } }
        
    }  catch(e){
        console.log(e); 
    }
}

module.exports={sendMessage , getRecieverSocketId}