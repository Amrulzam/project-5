import React from "react";
import { Stack, Box } from "@mui/material";
import Chatting from "./chatting/Chatting.jsx";
import { useSelector } from "react-redux";

const ChatBox = () => {

  const user = useSelector((state)=>state.userSlice);
  const chatting = useSelector((state=> state.chattingSlice));

  console.log(chatting.name);

  return (
    <div className="chat-box-wrapper">
      <Chatting
        props={{
          img: chatting.img ||"assets/pic4.jpg",
          name: chatting.name|| "unknown user",
          state: chatting._state||"last seen",
          room: "hello",
          sender: user.userName,
          sender_id:user.id,
          receiver_id: chatting.id
        }}
      />
    </div>
  );
};

export default ChatBox;
