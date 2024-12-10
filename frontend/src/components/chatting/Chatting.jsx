import React, { useState, useRef, useEffect } from "react";
import "./Chatting.css";
import {
  Badge,
  IconButton,
  Stack,
  Typography,
  Box,
  Fab,
  Tooltip,
} from "@mui/material";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import Sender from "../sender/Sender";
import Reciever from "../reciever/Reciever";
import { nanoid } from "nanoid";
import { useSelector, useDispatch } from "react-redux";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import {
  PhoneCall,
  MagnifyingGlass,
  CaretDown,
  Plus,
  Smiley,
  PaperPlaneRight,
  Microphone,
  Images,
  Camera,
  File,
  UserSquare,
  DotsThreeVertical,
} from "@phosphor-icons/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import { setRoom } from "../../features/roomSlice";
import { setMessages } from "../../features/chattingSlice";
import { selectSocket } from "../../features/socketSlice";

const Chatting = ({ props }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const room = useSelector((state) => state.roomSlice.room);
  const chatting = useSelector((state)=>state.chattingSlice);

  const socket = useSocket();
  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState(chatting.messages||[]);

/*   useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post("http://localhost:4002/message/get", {
            SENDER_ID: props.sender_id,
            RECEIVER_ID: props.receiver_id,
        }).then((res)=>{
          console.log("chat received ");
          setChats(res.data.data);
        })
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  },[msg]); */

  const [emojiOpen, setEmojiOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const chatEndRef = useRef();
  const receiverId = props.receiver_id;

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  useEffect(() => {
    localStorage.setItem("currentUser", props.name);
    setChats(chatting.messages)
  }, [chatting.messages]);

/*   useEffect(() => {
    socket.on("private message", (data) => {
      setChats((prev) => [...prev, data]);
    });

    return () => socket.off("message");
  }, []); */

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  useEffect(() => {
    const handleMessage = (data) => {
      console.log("Received message:", data);
      setChats((prev) => [...prev, data]);
    };

    // Add listener
    socket.on("privateMessage", handleMessage);

    // Cleanup listener to prevent duplicates
    return () => {
      socket.off("privateMessage", handleMessage);
    };
  }, [socket]);

  const media = [
    {
      icon: <Images size={28} />,
      name: "Photos and Videos",
    },
    {
      icon: <Camera size={28} />,
      name: "Camera",
    },
    {
      icon: <File size={28} />,
      name: "Document",
    },
    {
      icon: <UserSquare size={28} />,
      name: "Contact",
    },
  ];

  const textArea = useRef();

  const sendMessage = async () => {
    if (msg.trim() !== "") {
      let messageData = {
        CHAT_ID: nanoid(),
        MESSAGE: msg,
        SENDER: props.name,
        SENDER_ID: props.sender_id,
        RECEIVER_ID: props.receiver_id,
        TIME_STAMP: `${new Date().getHours()}:${new Date()
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
      };
      setChats((prev) => [...prev, messageData]);

      //dispatch(setMessages({ userMessages: chats }));

      await axios
        .post("http://localhost:4002/message/upload", messageData)
        .then((res) => {
          console.log(res.data.message);
        })
        .catch((err) => {
          console.log("Error uploading message at chatting- frontend: " + err);
        });

      socket.emit("sendMessageToUser", { receiverId,messageData });

      setMsg("");
      textArea.current.value = "";
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMsg((prev) => prev + emoji.native);
    textArea.current.value += emoji.native;
  };

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
          <Stack
            direction="row"
            sx={{
              minWidth: "250px",
            }}
          >
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
                style={{ borderRadius: "50%", marginLeft: "10px" }}
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
              <Typography
                variant="h6"
                sx={{
                  fontSize: "1.2rem",
                }}
              >
                {props.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.9rem",
                }}
              >
                {props.state}
              </Typography>
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
                <DotsThreeVertical size={25} />
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
          {chats.map((chat,index) => {
            return (
              <li key={index} ref={chatEndRef}>
                {chat.SENDER_ID == props.sender_id ? (
                  <Sender
                    props={{
                      img: "assets/pic1.jpg",
                      type: "text",
                      msg: chat.MESSAGE,
                      time: chat.TIME_STAMP,
                      imgList: [
                        "assets/pic1.jpg",
                        "assets/pic4.jpg",
                        "assets/pic4.jpg",
                        "assets/pic5.jpg",
                        "assets/pic5.jpg",
                      ],
                      sender: chat.SENDER,
                    }}
                  />
                ) : (
                  <Reciever
                    props={{
                      img: "assets/pic4.jpg",
                      type: "text",
                      msg: chat.MESSAGE,
                      imgList: [
                        "assets/pic1.jpg",
                        "assets/pic4.jpg",
                        "assets/pic4.jpg",
                        "assets/pic5.jpg",
                        "assets/pic5.jpg",
                      ],
                      time: chat.TIME_STAMP,
                      sender: chat.SENDER,
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* footer part */}
      <div className="chatting-bottom">
        <ul>
          <li className="chat-media" style={{ position: "relative" }}>
            <Stack
              sx={{
                position: "absolute",
                bottom: "70px",
                display: mediaOpen ? "block" : "none",
                backgroundColor: "#878787",
                borderRadius: 1,
                color: "whitesmoke",
              }}
            >
              {media.map((medi, index) => (
                <Tooltip key={index} placement="right" title={medi.name}>
                  <IconButton
                    sx={{
                      color: "whitesmoke",
                      "&:hover": {
                        color: "#000",
                      },
                    }}
                  >
                    {medi.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Stack>
            <Plus
              size={25}
              onClick={() => {
                setEmojiOpen(false);
                setMediaOpen(!mediaOpen);
              }}
            />
          </li>
          <li className="chat-emoji" style={{ position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                bottom: "70px",
                zIndex: 10,
                left: "34%",
                display: emojiOpen ? "block" : "none",
              }}
            >
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                style={{ position: "absolute", bottom: "70px", left: "34%" }}
              />
            </Box>
            <Smiley
              size={25}
              onClick={() => {
                setMediaOpen(false);
                setEmojiOpen(!emojiOpen);
              }}
            />
          </li>
        </ul>

        <div className="chat-input">
          <textarea
            ref={textArea}
            onChange={(e) => {
              setMsg(e.target.value);
            }}
            placeholder="Type anything..."
            onKeyDown={(e) => {
              if (e.key == "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
                setEmojiOpen(false);
                setMediaOpen(false);
              }
            }}
          ></textarea>
        </div>
        <div className="chat-send">
          <div>
            {msg == "" ? (
              <Microphone size={23} />
            ) : (
              <PaperPlaneRight
                size={23}
                onClick={() => {
                  sendMessage();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
