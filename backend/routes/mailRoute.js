const express = require('express');
const {sendOTP, verifyOTP} = require('../controllers/sendMail');
const router = express.Router();

router.get('/sendOtp/:email', async (req, res)=>{
    const email = req.params.email;
    if(email == ""){
        return res.status(404).json({message:'Email cannot be Empty'});
    }
    try{
        const sendOtp = await sendOTP(email);
        if(sendOtp.error){
            return res.status(404).json({message: sendOtp.message});
        }

        res.status(200).json({message: sendOtp.message});

    }catch(err){
        res.status(500).json({message:"Failed to send OPT"})
    }
})

router.post('/verifyOtp', async (req,res)=>{
    const {email,otp} = req.body;
    if(!email || !otp){
        return res.status(404).json({message:"credentials are empty"});
    }
    try{
        const verifyOtp = await verifyOTP(email,otp);
        console.log(verifyOtp.message);
        if(verifyOtp.error){
            return res.status(404).json({message:verifyOtp.message});
        }
        if(!verifyOtp.verified){
            return res.status(404).json({message:verifyOtp.message});
        }
        res.status(200).json({message:verifyOtp.message, isAuthenticated:verifyOtp.verified});

    }catch(err){
        res.status(500).json({message:"Verification failed",error:err})
    }
})


module.exports = router
