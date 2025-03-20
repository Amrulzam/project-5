import React, { useState } from "react";
import "./RecoverCard.css";
import { Envelope,ArrowRight } from "@phosphor-icons/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecoverCard = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleClick =async ()=>{
    if(!email) return console.log("Email field cannot be empty");

    let tokenGot;

    let userVerified = false;
    await axios.get(`http://localhost:4002/verify/${email}`,{}).then((res)=>{
      const {message, exists, token} = res.data;
      if(!exists){
        alert(message);
        return console.log(message);
      }
      console.log(message);
      tokenGot = token;
      userVerified =true;
    }).catch((err)=>{
      console.log(err);
    })

    if(userVerified){
      await axios.get(`http://localhost:4002/mail/sendOtp/${email}`).then((res)=>{
        const {message} = res.data;
        alert(message);

        navigate(`/verify_otp/${email}?recover=true`,{state:{
          token: tokenGot
        }});

      }).catch((err)=>{
        console.log("something went wrong when getting OTP "+err);
      })
    }

  }

  return (
    <div className="recover-card-wrapper">
      <h3>Forgot Password !</h3>
      <div className="recover-input">
        <Envelope size={20} />
        <input type="email" placeholder="Enter Email"  onChange={(e)=>{setEmail(e.target.value)}}/>
      </div>
      <div id="btn-recover">
        <button type="sudmit" onClick={()=>{handleClick()}}>Next <ArrowRight size={18} fontWeight="700" style={{marginLeft:"7px"}}/></button>
      </div>
    </div>
  );
};

export default RecoverCard;
