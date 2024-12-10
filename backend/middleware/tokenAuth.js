const jwt = require('jsonwebtoken');

const verifyToken = async(req,res,next)=>{

    try{
        let token = req.header('Authorization');
        if(!token){
            return res.status(403).json({message:"Access Denied"});
        }

        if(token.startsWith("Bearer ")){
            token = token.slice(7,token.length).trimLeft();
        }else {
            return res.status(403).json({ message: "Invalid Authorization header format" });
        }

        const verified = jwt.verify(token,'secret_key');
        req.user= verified;
        next()

    }catch(err){
        console.error("Token verification error:", err);
        return res.status(401).json({ message: "Invalid or Expired Token" });
    }
}


module.exports = {verifyToken}
