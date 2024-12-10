const jwt = require('jsonwebtoken');


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
        res.status(200).json({message:"Please Login"});
    }
}

module.exports = {verifyLogin};
