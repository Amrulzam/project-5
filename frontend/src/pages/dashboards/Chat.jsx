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
import { setChatting } from "../../features/chattingSlice";

const Chat = () => {
  const selectedIndex = useSelector((state) => state.sideBarSlice.select);
  const socket = useSocket();
  const user = useSelector((state) => state.userSlice);
  const chatting = useSelector((state) => state.chattingSlice);

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

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
  });

  useEffect(() => {
    // Function to update screen size
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
      });
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [screenSize.width]);

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
          style={{
            display:
              screenSize.width < 670
                ? chatting.selected == false
                  ? "block"
                  : "none"
                : "block",
                minWidth: "60px",
          }}
          sx={{
            height: "100vh",
            width: "5%",
          }}
        >
          <SideBar />
        </Box>

        {/* chats*/}
        <Box
          style={{
            display:
              screenSize.width < 670
                ? chatting.selected == false
                  ? "block"
                  : "none"
                : "block",
          }}
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
          style={{
            display:
              screenSize.width < 500
                ? chatting.selected == false
                  ? "none"
                  : "block"
                : "block",
                width:"100%"
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
