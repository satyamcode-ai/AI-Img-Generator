import Chat from "../models/chat.js";
import User from "../models/user.js";
import axios from 'axios';
import imagekit from "../config/imageKit.js";
import openai from "../config/openAi.js";

export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id; // middleware attaches req.user

    if(req.user.credits < 2){
      return res.json({
        success:false, message:"You dont have enough credits to use this feature"
      })
    }

    const { chatId, prompt } = req.body;

    // Find chat for this user
    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    // Push new message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const {choices} = await openai.chat.completions.create({
      model:"gemini-2.0-flash",
      messages:[
        {
          role:"user",
          content: prompt,
        },
      ],
    });

    const reply = {...choices[0].message,timestamp: Date.now(),
      isImage: false}

    res.status(200).json({
      success: true,
      message: "Message added successfully",
      reply,
    });

    chat.messages.push(reply)

    await chat.save();

    await User.updateOne({_id:userId},{$inc:{credits: -1}})

  } catch (error) {
    console.error("textMessageController error:", error);
    return res
      .status(500)
      .json({ success: false, error: error.message });
  }
};

// Image Generation Message Controller

export const imageMessageController = async (req,res) => {
  try {
    const userId = req.user._id;

    if(req.user.credits < 2){
      return res.json({
        success:false, message:"You dont have enough credits to use this feature"
      })
    }

    const {prompt,chatId,isPublished} = req.body

    const chat = await Chat.findOne({userId, _id:chatId})

    chat.messages.push({
      role:"user",
      content:prompt,
      timestamp: Date.now(),
      isImage:false
    })

    const encodedPrompt = encodeURIComponent(prompt)

    const generatedImageUrl = `${process.env.IMAGEKI_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

    const aiImageResponse = await axios.get(generatedImageUrl, {responseType: "arraybuffer"})

    const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data,"binary").toString('base64')}`;

// Upload to ImageKit Media Library
    const uploadResponse = await imagekit.upload({
    file: base64Image,
    fileName: `${Date.now()}.png`,
    folder: "quickgpt"
  })

  const reply = {
    role: 'assistant',
    content: uploadResponse.url,
    timestamp: Date.now(),
    isImage: true,
    isPublished
}

res.json({success: true, reply})

chat.messages.push(reply)
await chat.save()

await User.updateOne({_id:userId},{$inc:{credits : -2}})

  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: error.message });
  }
}
