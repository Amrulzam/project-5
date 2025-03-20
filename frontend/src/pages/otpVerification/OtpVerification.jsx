import React, { useRef } from "react";
import "./OtpVerification.css";
import { ArrowRight } from "@phosphor-icons/react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const register = searchParams.get("register") || false;
  const recover = searchParams.get("recover") || false;
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const inputVals = [];

  const handleInputChange = (index, e) => {
    if (e.target.value.length === 1 && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }
    if (index != 0) {
      if (e.target.value == "" && inputRefs[index - 1].current.value != "") {
        inputRefs[index - 1].current.focus();
      }
    }
  };

  const { email } = useParams();

  const handleClick = async () => {
    const code = inputVals.join("");

    if (!code || !email) {
      return console.log("OTP cannot be empty");
    }

    let isAuthenticated = false;
    await axios
      .post(`http://localhost:4002/mail/verifyOtp`, {
        email: email,
        otp: code,
      })
      .then((res) => {
        const { message, isAuthenticated: auth } = res.data;
        alert(message);
        isAuthenticated = auth;
        console.log(isAuthenticated);
      })
      .catch((err) => {
        console.log("something wrong when verifying OTP " + err);
      });

    if (isAuthenticated && register) {
      const { fName, lName, password } = location.state;
      await axios
        .post("http://localhost:4002/register", {
          fName: fName,
          lName: lName,
          email: email,
          password: password,
        })
        .then((res) => {
          const { error, message, privateKey } = res.data;
          if (error) {
            alert(message);
          } else {
            console.log(message);
            localStorage.setItem("privateKey", privateKey);
            navigate("/login", { replace: false });
          }
        })
        .catch((err) => {
          console.error("Failed to Register:", err);
        });
    }

    if (isAuthenticated && recover) {
        if(!email){
            console.log("Email cannot be empty");
        }

        const {token} = location.state;
        navigate(`passwords`,{state:{
            token:token
        }});
    }
  };

  return (
    <div className="otp-varification-wrapper">
      <div className="verification">
        <h2>We sent your OTP</h2>
        <p>
          <i>Enter the confirmation code below</i>
        </p>
        <div className="verification-inputs">
          {inputRefs.map((ref, index) => (
            <input
              key={index}
              ref={ref}
              type="text"
              maxLength="1"
              onChange={(e) => {
                handleInputChange(index, e);
                if (e.target.value) {
                  inputVals.push(e.target.value);
                }
              }}
            />
          ))}
        </div>
        <div className="verification-btns">
          <button
            className="verify"
            onClick={() => {
              handleClick();
            }}
          >
            verify
            <ArrowRight size={20} style={{ marginLeft: "0.2rem" }} />
          </button>
          <p>Resend OTP</p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;


