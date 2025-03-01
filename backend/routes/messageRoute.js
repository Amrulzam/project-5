const express = require('express');
const {uploadMessage,getMessage} = require('../controllers/messageInfo');
const {DateTime} = require('luxon');

const router = express.Router();

router.post('/get', async (req,res)=>{
    const {SENDER_ID, RECEIVER_ID} = req.body;
    try{
        const info = await getMessage(SENDER_ID, RECEIVER_ID);
        if(info.error){
            return res.status(200).json({message:info.message,data:info.data});
        }

        return res.status(200).json({message:info.message,data:info.data});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
})

router.post('/upload', async(req,res)=>{
    const {CHAT_ID,SENDER, MESSAGE,SENDER_ID, RECEIVER_ID, TIME_STAMP} = req.body;

    try{
        const msgData = {
            CHAT_ID,
            SENDER,
            MESSAGE,
            SENDER_ID,
            RECEIVER_ID,
            TIME_STAMP :TIME_STAMP || DateTime.now().toSQL(),
        }
        const msg = await uploadMessage(msgData);
        if(msg.error){
            return res.status(500).json({message:msg.message});
        }
        return res.status(200).json({message:msg.message});
    }catch(err){
        return res.status(500).json({message:"Couldn't upload message"});
    }
})


module.exports = router;
