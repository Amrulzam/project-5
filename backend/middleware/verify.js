const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyLogin = async (req,res)=>{
    try{
        let token = req.header("Authorization");
        if(!token) return console.log("Please Login");

        if(token.startsWith('Bearer ')){
            token = token.slice(7,token.length).trimLeft();
        }else{
            /* res.status(403).json({message:"Please Login"}) */
            console.log("Please Login");
        }
        const verified = jwt.verify(token, "secretkey");
        req.user= verified;

        res.status(200).json({loggedState:true});

    }catch(err){
        res.status(401).json({message:"Please Login"});
    }
}

const verifyCPassword = async (req,res,next) =>{
    let token = req.header('Authorization');

    try{
        if(!token) return console.log("Please verify your email");

        if(token.startsWith('Bearer ')){
            token = token.slice(7).trim();
        }else{
            return res.status(403).json({message:"Please verify your email", verification:false});
        }
        const verified = jwt.verify(token,process.env.SECRET_KEY || "secret_key");
        req.user = verified;
        next();
    }catch(err){
        res.status(500).json({message:"Verification failed"});
    }
}

module.exports = {verifyLogin, verifyCPassword};
