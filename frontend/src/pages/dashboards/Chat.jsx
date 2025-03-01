import React, { useState, useEffect } from "react";
import "./Chat.css";
import Stack from "@mui/material/Stack";
import { Box, IconButton } from "@mui/material";
import SideBar from "../../components/SideBar";
import Chats from "../../components/Chats";
import ChatBox from "../../components/ChatBox";
import { useDispatch, useSelector } from "react-redux";
import Users from "../../components/users/Users";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setSocket } from "../../features/socketSlice";
import { io } from "socket.io-client";
import { useSocket } from "../../context/SocketContext";

const Chat = () => {
  const selectedIndex = useSelector((state) => state.sideBarSlice.select);
  const socket = useSocket();
  const user = useSelector((state)=>state.userSlice);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log("Chat component rendered");
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4002/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data.loggedState) {
          navigate("/login", { replace: false });
        }
      } catch (err) {
        console.error(err);
      }
    };

    verifyUser();
    socket.emit("register", user.id);
  }, [socket, user.id, navigate]);


  let chatContent;
  switch (selectedIndex) {
    case 1:
      chatContent = <Chats />;
      break;
    case 2:
      chatContent = <Users />;
      break;
    case 3:
      chatContent = <div>Option 3 Content</div>;
      break;
    case 4:
      chatContent = <div>Option 4 Content</div>;
      break;
    default:
      chatContent = <div>Default Content</div>;
      break;
  }

  return (
    <div className="chat-wrapper">
      <Stack
        direction="row"
        sx={{
          width: "100%",
          height: "100vh",
          justifyContent: "space-between",
        }}
        className="chat-main"
      >
        {/* box 1 */}
        <Box
          sx={{
            height: "100vh",
            width: "5%",
          }}
          style={{ minWidth: "60px" }}
        >
          <SideBar />
        </Box>

        {/* chats*/}
        <Box
          sx={{
            height: "100vh",
            width: "25%",
            minWidth: "330px",
          }}
          className="chats"
        >
          {chatContent}
        </Box>

        {/* chat box */}
        <Box
          sx={{
            height: "100vh",
            width: "75%",
          }}
          className="chat-box"
        >
          <ChatBox />
        </Box>
      </Stack>
    </div>
  );
};

export default Chat;
