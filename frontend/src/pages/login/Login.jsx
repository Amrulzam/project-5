import React, { useState } from "react";
import "./Login.css";
import LoginCard from "../../components/loginCard/LoginCard";
import RegisterCard from "../../components/registerCard/RegisterCard";
import { UserCircle, AddressBook, Password } from "@phosphor-icons/react";
import RecoverCard from "../../components/recoverCard/RecoverCard.jsx";

const Login = () => {
  const [select, setSelect] = useState(1);
  return (
    <div className="login-wrapper">
      <h3>Start Seamless Chatting</h3>
      <div className="login">
        <div className="login-left">
          <img
            src="assets/pic5.jpg"
            alt="" /*  width="100px" height="100px" */
          />
        </div>
        <ul className="login-middle">
          <li
            onClick={() => {
              setSelect(1);
            }}
            style={
              select == 1
                ? { backgroundColor: "green", color: "whitesmoke" }
                : { backgroundColor: "transparent" }
            }
          >
            <UserCircle size={25} />
            <p>Login</p>
          </li>
          <li
            onClick={() => {
              setSelect(2);
            }}
            style={
              select == 2
                ? { backgroundColor: "green", color: "whitesmoke" }
                : { backgroundColor: "transparent" }
            }
          >
            <AddressBook size={25} />
            <p>Register</p>
          </li>
          <li
            onClick={() => {
              setSelect(3);
            }}
            style={
              select == 3
                ? { backgroundColor: "green", color: "whitesmoke" }
                : { backgroundColor: "transparent" }
            }
          >
            <Password size={25} />
            <p>Forgot Password?</p>
          </li>
        </ul>
        <div className={`login-right ${
          select === 1
            ? "animate-min-300"
            : select === 2
            ? "animate-min-400"
            : "animate-min-500"
        }`}>
          <div className={select === 1 ? "show" : "hide"}>
            <LoginCard />
          </div>
          <div className={select === 2 ? "show" : "hide"} id="login-right-div-2">
            <RegisterCard />
          </div>
          <div className={select === 3 ? "show" : "hide"}>
            <RecoverCard />
          </div>
        </div>
      </div>
      <p>2024 Conn-Act | All rights reserved</p>
    </div>
  );
};

export default Login;
