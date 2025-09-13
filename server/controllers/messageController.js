import Chat from "../models/Chat.js";


// text based ai chat message controller
export const textMessageController = async ()=>{
    try {
        const userId = req.user._id;
        const {chatId, prompt} = req.body

        const chat = await Chat.findOne({userId, _id :chatId});
        chat.messages.push({role : "user", content:prompt, timestamp : Date.now(), isImage: false})
        
        
    } catch (error) {
        
    }
}