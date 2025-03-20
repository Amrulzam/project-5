const express = require('express');
const {verifyToken} = require('../middleware/tokenAuth');
const {getUser} = require('../controllers/userInfo');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const router = express.Router();

router.get('/',verifyToken,async(req,res)=>{
    try{
        res.status(200).json({loggedState:true});
    }catch(err){
        res.status(500).json({message:err.message});
    }
})

router.get('/:email', async (req,res)=>{
    const email = req.params.email;
    try{
        const gotUser = await getUser(email);
        if(!gotUser.exists){
            return res.status(404).json({message:"No user Exists", exists: gotUser.exists});
        }

        const token = jwt.sign({ID: gotUser.info.ID, EMAIL: gotUser.info.EMAIL},process.env.SECRET_KEY || 'secret_key', {expiresIn:'0.5h'});
        res.status(200).json({message:"One match found", exists:gotUser.exists,token});

    }catch(err){
        res.status(500).json({message: err.message,exists:false});
    }
})

module.exports = router ;
