import React, { useState, useEffect, useRef, forwardRef } from "react";
import "./ChatCardText.css";
import { Box, Typography, Stack } from "@mui/material";
import {
  DotsThreeVertical,
  ArrowBendUpLeft,
  Copy,
  FolderUser,
  ArrowBendUpRight,
  Star,
  Backspace,
} from "@phosphor-icons/react";

const Profile = ({ img }) => {
  return (
    <div className="sender-img">
      <img src={img} alt="Sender Profile" />
    </div>
  );
};

const Message = forwardRef(({ props }, ref) => {
  return (
    <Box
      sx={{
        width: "auto",
        maxWidth: "60%",
        marginTop: "15px",
        marginLeft: "10px",
        marginRight: "10px",
        padding: "7px",
        borderRadius: "8px",
        height: "auto",
        backgroundColor: "rgb(192, 215, 223)",
        color: "whitesmoke",
      }}
    >
      {/* Sender's Name */}
      <Stack
        direction="row"
        sx={{
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            color: "rgb(78, 90, 94)",
            fontWeight: 800,
          }}
        >
          {props.sender || "Unknown Sender"}
        </Typography>

        <Box
          sx={{
            background: "none",
            color: "#000",
            "&:hover": { color: "#fff", backgroundColor: "#878787" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "fit-content",
            width: "fit-content",
            borderRadius: 1,
          }}
          onClick={(e)=>{props.setMoreOptionsOpen(e)}}
          ref={ref}
        >
          <DotsThreeVertical size={25} />
        </Box>
      </Stack>

      {/* Message and Media Content */}
      <Stack
        direction="column"
        sx={{
          height: "auto",
          width: "auto",
          maxWidth: "fit-content",
        }}
      >
        <Typography
          sx={{
            width: "fit-content",
            backgroundColor: "rgb(127, 148, 155)",
            padding: "5px",
            borderRadius: "6px",
            color: "white",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {props.msg || ""}
        </Typography>
      </Stack>
    </Box>
  );
});

const TimeAndMore = forwardRef(({ props }, ref) => {
  return (
    <div
      className="sender-time"
      style={{
        position: "relative",
        width: "auto",
      }}
    >
      {/* <div
        style={{
          position: "absolute",
          top: "20px",
          right:` ${props.isSender?"5px":"-100px"}`,
          width: "150px",
          maxHeight: "400px",
          height: "fit-content",
          backgroundColor: "rgb(146, 173, 183)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
        className={props.moreOptionsOpen ? "show" : "hide"}
        ref={ref}
      >
        {props.moreOptions.map((option, index) => (
          <div
            key={index}
            style={{ width: "100%", padding: "6px", cursor: "pointer" }}
            id="more-options"
            onClick={() => {
            }}
          >
            <p
              style={{
                display: "flex",
                width: "fit-content",
                justifyContent: "flex-start",
                alignItems: "center",
                marginLeft: "5px",
              }}
            >
              {option.icon}{" "}
              <span style={{ fontSize: "0.9rem", marginLeft: "10px" }}>
                {option.title}
              </span>
            </p>
          </div>
        ))}
      </div> */}
      <p>{props.time || "00:00"}</p>
    </div>
  );
});

const ChatCardText = ({ props }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isSender, setIsSender] = useState(true);

  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const optionRef = useRef();

  useEffect(()=>{
    setIsSender(props.isSender);
  },[])
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

  useEffect(() => {
    const handlefocus = (e) => {
      if (optionRef.current && !optionRef.current.contains(e.target)) {
        setMoreOptionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handlefocus);

    return () => {
      document.removeEventListener("mousedown", handlefocus);
    };
  }, []);

  const chatItems = [
    <TimeAndMore
      props={{
        time: props.time,
        isSender:isSender
      }}
      ref={optionRef}
    />,
    <Message
      props={{
        sender: props.sender,
        msg: props.msg,
        moreOptionsOpen: moreOptionsOpen,
        setMoreOptionsOpen: props.setMousePosition,
      }}
      ref={optionRef}
    />,
    <Profile img={props.img} />,
  ];

  return (
    <div className="main-chat-text-wrapper" >
      {isSender ? (
        <div className="chat-card-text-wrapper" style={{justifyContent:'right'}}>
          {chatItems[0]}
          {chatItems[1]}
          {chatItems[2]}
        </div>
      ) : (
        <div className="chat-card-text-wrapper" style={{justifyContent:'left'}}>
          {chatItems[2]}
          {chatItems[1]}
          {chatItems[0]}
        </div>
      )}
    </div>
  );
};

export default ChatCardText;
