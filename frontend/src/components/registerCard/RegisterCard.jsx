import React, { useState } from "react";
import "./RegisterCard.css";
import { EnvelopeSimple, Key, IdentificationCard } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterCard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
  });
  const [cPassword, setCPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.fName || !user.lName || !user.email || !user.password) {
      alert("Please fill in all fields.");
      return;
    }

    if (user.password !== cPassword) {
      alert("Passwords do not match.");
      return;
    }

    axios
      .post("http://localhost:4002/register", {
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        password: user.password,
      })
      .then((res) => {
        const { error, message, privateKey } = res.data;
        if (error) {
          alert(message);
        } else {
          console.log(message);
          localStorage.setItem("privateKey", privateKey);
          setUser({
            fName: "",
            lName: "",
            email: "",
            password: "",
          })
          navigate("/login", { replace: false });
        }
      })
      .catch((err) => {
        console.error("Failed to Register:", err);
      });
  };

  return (
    <div className="register-card-wrapper">
      <form className="register-form" onSubmit={handleSubmit}>
        <h3>Register Here</h3>
        <ul>
          <li>
            <IdentificationCard size={20} />
            <input
              type="text"
              placeholder="First Name"
              onChange={(e) =>
                setUser((prev) => ({ ...prev, fName: e.target.value }))
              }
            />
          </li>
          <li>
            <IdentificationCard size={20} />
            <input
              type="text"
              placeholder="Last Name"
              onChange={(e) => {
                setUser((prev) => ({ ...prev, lName: e.target.value }));
              }}
            />
          </li>
          <li>
            <EnvelopeSimple size={20} />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => {
                setUser((prev) => ({ ...prev, email: e.target.value }));
              }}
            />
          </li>
          <li>
            <Key size={20} />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setUser((prev) => ({ ...prev, password: e.target.value }));
              }}
            />
          </li>
          <li>
            <Key size={20} />
            <input
              type="password"
              placeholder="Confirm-Password"
              onChange={(e) => {
                setCPassword(e.target.value);
              }}
            />
          </li>
          <li id="btn">
            <button type="submit">Register</button>
          </li>
        </ul>
      </form>
    </div>
  );
};

export default RegisterCard;
