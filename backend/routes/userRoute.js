const express = require('express');
const bcrypt = require('bcrypt');
const {verifyCPassword} = require('../middleware/verify');
const {updatePassword} = require('../controllers/userInfo');


const router = express.Router();


router.post('/changePass/:email',verifyCPassword,async (req, res)=>{
    const user = req.user;
    const {password} = req.body;
    try{
        if(!user) return res.status(403).json({message:"User Payload didn't found",updated:false});

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password,salt);

        const updateP = await updatePassword(user.ID, user.EMAIL, passwordHash);
        if(!updateP.done){
            return res.status(403).json({message:updateP.message,updated:false});
        }

        res.status(200).json({message:"Password updated successfully",updated:true});


    }catch(err){
        res.status(500).json({message:"Changing credentials failed",updated:false});
    }
})

module.exports = router
