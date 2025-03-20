const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { format } = require('path');
const {addUser, getUser,getAllUsers} = require('./userInfo');


const register = async (req,res) =>{
    try{
        const {fName,lName,email,password} = req.body

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password,salt);

        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
              type: 'spki',
              format: 'pem'
            },
            privateKeyEncoding: {
              type: 'pkcs8',
              format: 'pem'
            }
          });

          // Create user object
          const user = {
            fName,
            lName,
            email,
            password: passwordHash,
            publicKey: publicKey
          };

        const userAdded = await addUser(user);
        if(userAdded.error){
            return res.status(200).json({error:true,message:"User Already Exist"});
        }

        res.status(200).json({message:"User Registered Successfully",privateKey:privateKey})

    }catch(err){
        console.error("Registration error:", err); // Log error for debugging
        res.status(500).json({ message: err.message || "Internal Server Error" });
    }
}


const login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await getUser(email);
        if(!user.exists){
            return res.status(404).json({Message:"User Not Found"});
        }

        const isMatched = await bcrypt.compare(password,user.info.PASSWORD);
        if(!isMatched){
            return res.status(404).json({Message:"Incorrect Password"});
        }

        const token = jwt.sign({id:user.info.ID},"secret_key",{expiresIn:'1d'});
        user.info.PASSWORD= undefined;
        console.log("Login success");
        return res.status(200).json({token,user:user.info,message:"Login success"});

    }catch(err){
        console.error("Login error:", err); // Log error for debugging
        res.status(500).json({ message: err.message || "Internal Server Error" });
    }
}

const getAll = async (req,res)=>{
    try{
        const {email} = req.params;
        console.log("got params");
        const userData = await getAllUsers(email);
        console.log("got users");

        if(userData.info.length===0){
            return res.status(404).json({message:"Not Users Found"});
        }

        return res.status(200).json(userData);

    }catch(err){
        res.status(500).json({message:err.message});
    }
}

module.exports = {register ,login,getAll};
