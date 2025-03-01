const express = require('express');
const {getUserConversations, checkUserConversation,addUserConversation} = require('../controllers/userInfo');

const router = express.Router();

router.post('/:id', async(req,res)=>{
    try{
        const id= req.params.id;
        const data = await getUserConversations(id);
        if(data.exists==false){
            return res.status(404).json({message:"No Conversations Found",conversations:[]});
        }

        return res.status(200).json({message:"Converations Received", conversations:data.conversations})
    }catch(err){
        return res.status(500).json({message:"Something Went Wrong, Check Credentials"});
    }
})

router.post('/:sender_id/:receiver_id', async(req,res)=>{
    try{
        const sender_id = req.params.sender_id;
        const receiver_id = req.params.receiver_id;

        const data = await checkUserConversation(sender_id, receiver_id);

        res.status(200).json({exists:data.exists});

    }catch(err){
        res.status(500).json({message:"error validating conversation"});
    }
})

router.post('/add/:sender_id/:receiver_id/:message_id', async(req,res)=>{
    try{
        const sender_id = req.params.sender_id;
        const receiver_id = req.params.receiver_id;
        const message_id = req.params.message_id;

        const data = await addUserConversation(sender_id,receiver_id,message_id);

        res.status(200).json({done:data.done});

    }catch(err){
        res.status(500).json({message:"error validating conversation"});
    }
})

module.exports = router;
