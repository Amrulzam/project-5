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
import ChatCardText from "../messageCard/chatCardText/ChatCardText";
import Reciever from "../reciever/Reciever";
import { nanoid } from "nanoid";
import { useSelector, useDispatch } from "react-redux";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { setPosition } from "../../features/positionSlice";
import MessageOptions from '../messageCard/messageOptions/MessageOptions';

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
  ArrowBendUpLeft,
  Copy,
  FolderUser,
  ArrowBendUpRight,
  Star,
  Backspace,
  ArrowLeft,
} from "@phosphor-icons/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import { setRoom } from "../../features/roomSlice";
import { setDefault, setMessages } from "../../features/chattingSlice";
import { selectSocket } from "../../features/socketSlice";
import { DateTime } from "luxon";



const Chatting = ({ props }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const room = useSelector((state) => state.roomSlice.room);
  const chatting = useSelector((state) => state.chattingSlice);

  const socket = useSocket();
  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState(chatting.messages || []);
  const [messageReceiving, setMessageReceiving] = useState(false);

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
  const [messageOptionsOpen, setMessageOptionsOpen] = useState(false);

  const [haveMet, setHaveMet] = useState(null);
  const chatEndRef = useRef();
  const receiverId = props.receiver_id;

  const moreOptions = [
    {
      icon: <ArrowBendUpLeft size={25} />,
      title: "Reply",
    },
    {
      icon: <Copy size={25} />,
      title: "Copy",
    },
    {
      icon: <FolderUser size={25} />,
      title: "Reply Privately",
    },
    {
      icon: <ArrowBendUpRight size={25} />,
      title: "Forward",
    },
    {
      icon: <Star size={25} />,
      title: "Star",
    },
    {
      icon: <Backspace size={25} />,
      title: "Delete",
    },
  ];

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  useEffect(() => {
    localStorage.setItem("currentUser", props.name);
    setChats(chatting.messages);
  }, [chatting.messages]);

  /*   useEffect(() => {
    socket.on("private message", (data) => {
      setChats((prev) => [...prev, data]);
    });

    return () => socket.off("message");
  }, []); */

  useEffect(() => {
    axios
      .post(
        `http://localhost:4002/conversations/${props.sender_id}/${props.receiver_id}`
      )
      .then((res) => {
        console.log("conversation verified");
        setHaveMet(res.data.exists);
      })
      .catch((err) => {
        console.log("error verifying conversation "+err);
      });
  }, [chats]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [chats, messageReceiving]);

  useEffect(() => {
    setMessageReceiving(true);
    const handleMessage = (data) => {
      console.log("Received message:", data);
      setChats((prev) => [...prev, data]);
    };

    // Add listener
    socket.on("privateMessage", handleMessage);

    // Cleanup listener to prevent duplicates
    return () => {
      socket.off("privateMessage", handleMessage);
      setMessageReceiving(false);
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
        SENDER: props.sender,
        SENDER_ID: props.sender_id,
        RECEIVER_ID: props.receiver_id,
        TIME_STAMP: DateTime.now().toISO({ includeOffset: false }),
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

      socket.emit("sendMessageToUser", { receiverId, messageData });

      if (!haveMet) {
        axios
          .post(
            `http://localhost:4002/conversations/add/${props.sender_id}/${props.receiver_id}/${messageData.CHAT_ID}`
          )
          .then((res) => {
            console.log("conversation created " + res.data.done);
          })
          .catch((err) => {
            console.log(
              "error on creating conversation " +
                localStorage.getItem("currentUser")
            );
          });
      }
      setMsg("");
      textArea.current.value = "";
    }
  };

  const mousePosition = useSelector((state)=>state.positionSlice);

  const handleMessageOptions = (e) => {
    dispatch(setPosition({ x_cor: e.clientX || 100, y_cor: e.clientY || 100 }));
    setMessageOptionsOpen(!messageOptionsOpen);
  };

  const handleEmojiSelect = (emoji) => {
    setMsg((prev) => prev + emoji.native);
    textArea.current.value += emoji.native;
  };

  return (
    <div>
      {chatting.id==""?
      <div className="chatting-wrapper-blank-outer">
        <div className="chatting-wrapper-blank-inner"><p>Select A Conversation</p></div>
      </div>
      :<div className="chatting-wrapper">
      <div className="message-more-options" style={{left:`${mousePosition.x}px`,top:`${mousePosition.y}px`}}>
        <MessageOptions props={{
          moreOptions:moreOptions,
          moreOptionsOpen:messageOptionsOpen,
          setMoreOptionsOpen:setMessageOptionsOpen
        }} />
      </div>
      <div className="chatting-top">
        <Stack
          direction="row"
          sx={{
            width: "100%",
            justifyContent: "space-between",
            border: "1px solid #000",
          }}
        >
          <Stack
            direction="row"
            sx={{
              minWidth: "250px",
            }}
          >
            <IconButton className="chat-back-icon" sx={{
              borderRadius:2,
              padding:"0px 10px",
              fontWeight:500,
            }} onClick={()=>{dispatch(setDefault())}}><ArrowLeft size="1.5rem"/></IconButton>


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
            spacing={1}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={screen.width < 500 ? 0 : 1.5}>
              <IconButton sx={{
              borderRadius:2,
              fontWeight:500,
            }}>
                <PhoneCall size="1.35rem" />
              </IconButton>
              <IconButton sx={{
              borderRadius:2,
              fontWeight:500,
            }}>
                <VideoCallIcon fontSize="1.35rem" />
              </IconButton>
              <IconButton sx={{
              borderRadius:2,
              fontWeight:500,
            }}>
                <MagnifyingGlass size="1.35rem" />
              </IconButton>
            </Stack>
            <Box
              sx={{
                borderLeft: 0.3,
                paddingLeft: "10px",
              }}
            >
              <IconButton sx={{
              borderRadius:2,
              fontWeight:500,
            }}>
                <DotsThreeVertical size="1.35rem" />
              </IconButton>
            </Box>
          </Stack>
        </Stack>
      </div>
      <div className="chatting-middle">
        <div className="down-icon">
          <CaretDown size="1.3rem" />
        </div>
        <ul>
          {chats.map((chat, index) => {
            return (
              <li key={index} ref={chatEndRef}>
                {chat.SENDER_ID == props.sender_id ? (
                  <ChatCardText
                    props={{
                      img: "assets/pic1.jpg",
                      msg: chat.MESSAGE,
                      time: `${DateTime.fromISO(chat.TIME_STAMP).toFormat(
                        "HH:mm a"
                      )}`,
                      sender: chat.SENDER,
                      isSender: true,
                      setMousePosition:handleMessageOptions
                    }}
                  />
                ) : chat.RECEIVER_ID == props.receiver_id || props.sender_id ? (
                  <ChatCardText
                    props={{
                      img: "assets/pic1.jpg",
                      msg: chat.MESSAGE,
                      time: `${DateTime.fromISO(chat.TIME_STAMP).toFormat(
                        "HH:mm a"
                      )}`,
                      sender: chat.SENDER,
                      isSender: false,
                      setMousePosition:handleMessageOptions
                    }}
                  />
                ) : (
                  "alert"
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
              size="1.3rem"
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
              size="1.3rem"
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
              <Microphone size="1.3rem" />
            ) : (
              <PaperPlaneRight
                size="1.3rem"
                onClick={() => {
                  sendMessage();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>}
    </div>
  );
};

export default Chatting;
