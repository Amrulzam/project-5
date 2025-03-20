const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD
    }
})


//sendMail(transporter, mailOptions);
const otpStore = {"attempts":{}};
const OTP_EXPIRY_TIME = 3 * 60 * 1000;

const unFreezeTime = 10 * 60 * 1000;

const sendOTP = async (email)=>{
    if(!otpStore["attempts"][email]){
        otpStore["attempts"][email] = {count: 0, freezed: false, unFreezeAt : 0  };
    }

    const attempt = otpStore["attempts"][email];

    if(attempt.freezed && Date.now() < attempt.unFreezeAt){
        return {message:"You have tried maximum attempt. wait...",error:true};
    }

    if(attempt.freezed && Date.now() > attempt.unFreezeAt){
        attempt.count = 0;
        attempt.freezed = false;
        attempt.unFreezeAt = 0;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = {otp , expiresAt: Date.now()+ OTP_EXPIRY_TIME};

    const mailOptions = {
        from:{
            name:"Conn-Act",
            address: process.env.USER
        },
        to: email,
        subject: "OPT Verification code",
        text: `your opt code ${otp}. Do not share to anyone.`,
        html : `<h3> your opt code ${otp}. Do not share to anyone. </h3>`,
    }

    try{
        if(attempt.count > 1){
            otpStore["attempts"][email] = {count:attempt.count, freezed:true, unFreezeAt: Date.now()+unFreezeTime};
            return {message:"You have tried maximum attempt. wait...",error:true};
        }

        await transporter.sendMail(mailOptions);
        attempt.count++;
        console.log("OTP Attempt: "+attempt.count);
        return {message : "OPT sent successfully",send: true};

    }catch(err){
        return {message:"Failed to send OPT", error:err};
    }
}

const verifyOTP = async (email, otp)=>{
    if (!email || !otp) return { message: "Email and OTP are required!",error:true };

    const storedOtpData = otpStore[email];
    if(!storedOtpData){
        return {message: "No OTP stored in this Email",error:true};
    }
    const { otp: storedOtp, expiresAt } = storedOtpData;
    if(Date.now() > expiresAt){
        delete otpStore[email];
        return { message: "OTP has expired!" ,error:true};
    }
    if(storedOtp==otp){
        delete otpStore[email];
        delete otpStore["attempts"][email];
        return {message:"Verification successfull",verified:true,error:false};
    }else{
        return {message:"Invalid or expired OTP!",error:true};
    }
}


module.exports = {sendOTP, verifyOTP}
