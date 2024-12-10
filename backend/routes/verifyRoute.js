const express = require('express');
const {verifyToken} = require('../middleware/tokenAuth');

const router = express.Router();

router.get('/',verifyToken,async(req,res)=>{
    try{
        res.status(200).json({loggedState:true});
    }catch(err){
        res.status(500).json({message:err.message});
    }
})

module.exports = router ;
