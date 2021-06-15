var mongoose=require('mongoose') ; 
//const Message = require('../models/message') ; 
const Accident= require("../models/accident"); 
const Secouriste = require('../models/Secouriste') ; 
const {User} = require('../models/User');


// adding message to data base
async function sendMessage(data){
    try{
        //creating message object
        const message =  new Message({senderId:data.senderId,accidentId:data.accidentId,content:data.content,date:data.date}); 
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
    const accidentId=data.accidentId ;
    const senderId= data.senderId ; 
    try{
    let accident = await Accident.findById(accidentId);  
    
    if(accident){ 
            if(accident.id_secouriste==senderId){   
                 let reciever=await  Secouriste.findById(accident.id_secouriste) ;
                     return reciever.socketId ; 
            }else{
                if(accident.id_temoin==senderId) {

                 let reciever= await User.findById(accident.id_temoin) ; 
                 if(reciever){
                    return reciever.socketId ;
                 }else{
                    let reciever= await Secouriste.find({_id:accident.id_temoin,isNormalUser:true}) ; 
                    return reciever.socketId ;
                 }}else{
                     return null ; 
                 }  
                }                 
        } else { console.log(" accident not found");
    return null ;}
    }catch(e){
        console.log(e) ; 
    }
}



module.exports={sendMessage , getRecieverSocketId,}