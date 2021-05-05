const {Message} = require('../models/Message') ; 
var mongoose=require('mongoose') ; 
const {Chat} = require('../models/chat')  ; 
const Secouriste = require('../models/Secouriste') ; 
const {User} = require('../models/User');


// adding message to data base
async function sendMessage(data){
    try{
        //creating message object
        const message =  new Message({senderId:data.senderId,chatId:data.chatId,content:data.content,date:data.date}); 
        const result =  message.save();
     } catch (e) {
        console.log(e); }}
        // done


async function deletSocketId(socketId){
            try{
            let user = await Chat.findById(chatId);  
            
            if(chat){ 
        
                    if(chat.secouristeId!=senderId){   
                         let reciever=await  Secouriste.findById(chat.secouristeId)
                             return reciever.socketId ; 
                         
                    }else{
                      
                         let reciever= await User.findById(chat.userId) ; 
                            return reciever.socketId ; 
                        }
                         
                } else { console.log(" chat not found");}
            }catch(e){
                console.log(e) ; 
            }
        }
        
 async function getRecieverSocketId(data){
    const chatId=data.chatId ;
    const senderId= data.senderId ; 
    try{
    let chat = await Chat.findById(chatId);  
    
    if(chat){ 

            if(chat.secouristeId!=senderId){   
                 let reciever=await  Secouriste.findById(chat.secouristeId)
                     return reciever.socketId ; 
                 
            }else{
              
                 let reciever= await User.findById(chat.userId) ; 
                    return reciever.socketId ; 
                }
                 
        } else { console.log(" chat not found");}
    }catch(e){
        console.log(e) ; 
    }
}


module.exports={sendMessage , getRecieverSocketId}