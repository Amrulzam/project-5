import React, { useState } from "react";
import "./LoginCard.css";
import { EnvelopeSimple, Key } from "@phosphor-icons/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../features/userSlice";
import { setSocket } from "../../features/socketSlice";
import { io } from "socket.io-client";
import { useSocket } from "../../context/SocketContext";

const LoginCard = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSocket = () => {
    const newSocket = io("http://localhost:4002", {
      auth: {
        serverOffset: 0,
      },
    });
    dispatch(
      setSocket({
        socket: newSocket,
      })
    );

    // Clean up the socket on page unload or component unmount
    window.addEventListener("beforeunload", () => {
      newSocket.disconnect();
    });
  };


  const handleSubmit = (e)=>{
    e.preventDefault();
    if(email!=="" && password!==""){
      axios.post('http://localhost:4002/login',{
        email:email,
        password:password
      }).then((res)=>{
        const {token,message,user} = res.data;
        localStorage.setItem('token',token);
        console.log(message);
        localStorage.setItem('loggedState',true);
        const userData = {
          userName:`${user.F_NAME} ${user.L_NAME}`,
          email: user.EMAIL,
          id:user.ID,
          lastSeen:"online"
        }
        dispatch(setUser(userData));
        handleSocket();
        navigate('/dashboards',{replace:false});
      }).catch((err)=>{
        console.error("request failed "+ err);
        alert("Login failed!");
    })

    }
  }

  return (
    <div className="login-card-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <h3>Login Here</h3>
        <ul>
          <li>
            <EnvelopeSimple size={20} />
            <input type="email" placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}}/>
          </li>
          <li>
            <Key size={20} />
            <input type="password" placeholder="Password"  onChange={(e)=>{setPassword(e.target.value)}}/>
          </li>
          <li id="btn">
            <button type="submit">Login</button>
          </li>
        </ul>
      </form>
    </div>
  );
};

export default LoginCard;
