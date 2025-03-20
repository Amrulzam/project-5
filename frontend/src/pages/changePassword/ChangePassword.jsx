import React, { useState } from "react";
import "./ChangePassword.css";
import { ArrowRight, Password } from "@phosphor-icons/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ChangePassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newPassword, setNewPasswrod] = useState("");
  const [confirmPassword, setConfirmPasswrod] = useState("");
  const { email } = useParams();

  const { token } = location.state;
  let updatedToken = token;

  const handleClick = () => {
    if (!newPassword || !confirmPassword || !updatedToken) {
      console.log("Fields cannot be empty");
    } else if (newPassword !== confirmPassword) {
      console.log("New pasword and Confirm password should be equal");
    }

    axios.post(`http://localhost:4002/update/changePass/${email}`,{
        password : confirmPassword
    },{
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${updatedToken}`
        }
    }).then((res)=>{
        const {message, updated} = res.data;
        if(!updated){
            return console.log(message);
        }
        updatedToken = undefined;
        alert(message);
        navigate('/login');
    }).catch((err)=>{
        console.log("Something went wrong when changing password "+err);
    })

  };

  return (
    <div className="change-password-wrapper">
      <div className="change">
        <h2>Change Password</h2>
        <p>
          {email} <br />
          <i>Enter new password below</i>
        </p>
        <div className="change-inputs">
          <input
            type="password"
            placeholder="Enter New Password"
            onChange={(e) => {
              setNewPasswrod(e.target.value);
            }}
          />
          <br />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => {
              setConfirmPasswrod(e.target.value);
            }}
          />
        </div>
        <br />

        <div className="change-btns">
          <button
            className="verify"
            onClick={() => {
              handleClick();
            }}
          >
            Proceed
            <ArrowRight size={20} style={{ marginLeft: "0.2rem" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
