import React, { useState, useRef, useEffect } from "react";
import "./Chatting.css";
import { Badge, IconButton, Stack, Typography, Box } from "@mui/material";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import Sender from "../sender/Sender";
import Reciever from "../reciever/Reciever";
import {nanoid} from 'nanoid';

import {
  PhoneCall,
  MagnifyingGlass,
  CaretDown,
  Plus,
  Smiley,
  PaperPlaneRight,
  Microphone,
} from "@phosphor-icons/react";

const Chatting = ({ props }) => {

    useEffect(()=>{
        localStorage.setItem('currentUser',"john");
    },[])

  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState([]);

  const textArea= useRef();

  const sendMessage = ()=>{
    if(msg.trim() !== ""){
        let messageData={
            id:nanoid(),
            text:msg,
            sender:localStorage.getItem('currentUser'),
            timeStamp:new Date().toLocaleTimeString(),
        }
        setChats((prev)=>[...prev,messageData]);
        setMsg("");
        textArea.current.value="";
    }
  }

  return (
    <div className="chatting-wrapper">
      <div className="chatting-top">
        <Stack
          direction="row"
          sx={{
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" sx={{
            minWidth:"250px"
          }}>
            <Badge
              anchorOrigin={{
                vertical: "bottom",
              }}
              badgeContent=""
              color="success"
              overlap="circular"
              variant="dot"
              sx={{
                "& .MuiBadge-dot": {
                  border: "2px solid white",
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                },
              }}
            >
              <img
                src={props.img}
                alt=""
                width="45px"
                height="45px"
                style={{ borderRadius: "50%",
                    marginLeft:"10px",
                 }}
              />
            </Badge>
            <Stack
              direction="column"
              sx={{
                marginLeft: "30px",
                alignItems: "left",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6"  sx={{
                fontSize:"1.2rem"
              }}>{props.name}</Typography>
              <Typography variant="caption" sx={{
                fontSize:"0.9rem"
              }}>{props.state}</Typography>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            spacing={4}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={3}>
              <IconButton>
                <PhoneCall size={25} />
              </IconButton>
              <IconButton>
                <VideoCallIcon fontSize="15px" />
              </IconButton>
              <IconButton>
                <MagnifyingGlass size={25} />
              </IconButton>
            </Stack>
            <Box
              sx={{
                borderLeft: 0.3,
                paddingLeft: "10px",
              }}
            >
              <IconButton>
                <CaretDown size={25} />
              </IconButton>
            </Box>
          </Stack>
        </Stack>
      </div>
      <div className="chatting-middle">
        <div className="down-icon">
          <CaretDown size={21} />
        </div>
        <ul>
          {
            chats.map((chat)=>{
                return(
                    <li key={chat.id}>
                        {chat.sender==localStorage.getItem('currentUser')?
                        <Sender props={{
                            img:"assets/pic1.jpg",
                            msg:chat.text,
                            time:chat.timeStamp
                        }} />:
                        <Reciever props={{
                            img:"assets/pic4.jpg",
                            msg:chat.text,
                            time:chat.timeStamp
                        }} /> }
                    </li>
                )
            })
          }
        </ul>
      </div>
      <div className="chatting-bottom">
        <ul>
          <li className="chat-media">
            <Plus size={25} />
          </li>
          <li className="chat-emoji">
            <Smiley size={25} />
          </li>
        </ul>

        <div className="chat-input">
          <textarea
          ref={textArea}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
          placeholder="Type anything..."
          onKeyDown={(e)=>{
            if(e.key=="Enter" && !e.shiftKey){
                e.preventDefault();
                sendMessage();
            }
          }}
          ></textarea>
        </div>
        <div className="chat-send">
          <div>
            {msg == "" ? (
              <Microphone size={23} />
            ) : (
              <PaperPlaneRight size={23} onClick={()=>{sendMessage()}}/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
