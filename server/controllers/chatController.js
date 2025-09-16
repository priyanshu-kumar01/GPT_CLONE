import Chat from "../models/Chat.js";



// Api controller to creating a new chat
// export const createChat = async (req, res)=>{
//     try {
//         const userId = req.body._id;

//         const chatData ={
//             userId,
//             messages : req.body.messages || [],
//             userName : req.user.name,
//             name : req.body.name
//         }

//         await Chat.create(chatData)
//         res.json({success: true, message : "Chat created"});
//     } catch (error) {
//         res.json({success: false, message : error.message});
//     }
// }
export const createChat = async (req, res) => {
  try {
    // take userId from the logged-in user
    const userId = req.user._id;  

    const chatData = {
      userId,
      userName: req.user.name,        
      name: "New Chat",         
      messages:[]
    };

    const chat = await Chat.create(chatData);
    res.json({ success: true, message: "Chat created" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};







// Api controller to get all chats 
export const getChats = async (req, res)=>{
    try {
        const userId = req.user._id;

        const chats = await Chat.find({ userId }).sort({updatedAt : -1});

        res.json({success: true, chats})


    } catch (error) {
         res.json({success: false, message : error.message});   
    }
}

// Api controller to delete all chats
export const delChats = async (req,res)=>{
    try {
        const userId = req.user._id;
        const {chatId} = req.body;
        await Chat.deleteOne({ _id: chatId, userId });

        res.json({success : true, message: "Chat Deleted"});
    } catch (error) {
         res.json({success: false, message : error.message});
    }
}