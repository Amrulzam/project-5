import React from "react";
import { Stack, Box } from "@mui/material";
import Chatting from "./chatting/Chatting.jsx";

const ChatBox = () => {
  return (
    <div className="chat-box-wrapper">
      <Chatting
        props={{
          img: "assets/pic4.jpg",
          name: "Ariana",
          state: "online",
        }}
      />
    </div>
  );
};

export default ChatBox;
