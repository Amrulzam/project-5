import React,{useState} from "react";
import './Chat.css';
import Stack from "@mui/material/Stack";
import { Box, IconButton } from "@mui/material";
import {ChatDots, Users, Phone, GearSix, UserCirclePlus, MagnifyingGlass} from "@phosphor-icons/react";
import SideBar from "../../components/SideBar";
import Chats from "../../components/Chats";
import ChatBox from "../../components/ChatBox";

const Chat = () => {



  return (
    <div className="chat-wrapper">
      <Stack
        direction="row"
        sx={{
            width:"100%",
            height:"100vh",
          justifyContent: "space-between",
        }} className="chat-main"
      >
        {/* box 1 */}
        <Box sx={{
            height:"100vh",
            width:"5%",
        }} style={{minWidth:"60px"}}>
            <SideBar />
        </Box>

        {/* chats*/}
        <Box sx={{
            height:"100vh",
            width:"25%",
            minWidth:"330px",
        }} className="chats"  >
            <Chats />
        </Box>

        {/* chat box */}
        <Box sx={{
            height:"100vh",
            width:"75%",
        }} className="chat-box" >
            <ChatBox />
        </Box>
      </Stack>
    </div>
  );
};

export default Chat;
