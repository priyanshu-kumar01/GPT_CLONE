import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import openai from "../configs/openAi.js";
import imagekit from "../configs/imageKit.js";

// text based ai chat message controller


export const textMessageController = async (req, res)=>{
    try {
        const userId = req.user._id;
        const {chatId, prompt} = req.body

        if(req.user.credits < 1){
            return res.json({success: false, message: "you don't have enough credits to use this features"});
        }

        const chat = await Chat.findOne({userId, _id :chatId});
        chat.messages.push({role : "user", content:prompt, timestamp : Date.now(), isImage: false})
        
        const {choices} = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
              {role: "system", content:"Youre are a helpful assistant."},
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const reply = {...choices[0].message, timestamp : Date.now(), isImage: false}
        res.json({success: true, reply});
        chat.messages.push(reply);

        await  chat.save()

        await User.updateOne({_id: userId}, {$inc : {credits: -1}})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// // Image Generation Message Controller
// export const imageMessageController = async (req,res)=>{
//     try {
//         const userId= req.body._id;
//         if(req.user.credits <= 2){
//             return res.json({success: false, message: " Don't have enough credits to use this feature"})
//         }

//         const {prompt, chatId, isPublished} = req.body;


//         //Find the user message
//         const chat = await Chat.findOne({userId, _id: chatId});

//         // push the user message
//         chat.messages.push({role: "user",
//             content: prompt, 
//             timestamp : Date.now(), 
//             isImage: false
//         });

//         // Encode the pormpt
//         const encodePrompt = encodeURIComponent(prompt);


//         //Construct ImageKit AI Generation Url

//         const generateImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodePrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

//         //Generating by fetching from imageKit
//         const aiImageResponse = await axios.get(generateImageUrl, {responseType: "arraybuffer"})
    
//         // converting to Base64
//         const base64Image = `data:imgae/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`;

//         //uploading to imagekit media library
//         const uploadResponse = await imageMessageController.upload({
//             file: base64Image,
//             fileName : `${Date.now()}.png`,
//             folder: "quickgpt"
//         })

//         const reply = {
//             role : "assistant",
//             content: uploadResponse.url,
//             timestamp:Date.now(),
//             isImage: true,
//             isPublished
//         }
         
//         res.json({success: true, reply});
//         chat.messages.push(reply);

//         await User.updateOne({_id: userId}, {$inc: {credits: -2}});
        
//     } catch (error) {
//         res.json({success:false, message:error.message})
//     }
// }

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id; // fixed
    if (req.user.credits < 2) {
      return res.json({ success: false, message: "Don't have enough credits" });
    }

    const { prompt, chatId, isPublished } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false
    });

    const encodePrompt = encodeURIComponent(prompt);
    const generateImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodePrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

    const aiImageResponse = await axios.get(generateImageUrl, { responseType: "arraybuffer" });

    const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString("base64")}`;

    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "quickgpt"
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished
    };

    res.json({ success: true, reply });
    chat.messages.push(reply);

    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
