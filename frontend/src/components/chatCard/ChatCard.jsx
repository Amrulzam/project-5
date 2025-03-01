import React from "react";
import "./ChatCard.css";
import { Typography, Badge, Stack } from "@mui/material";
import { useSelector } from "react-redux";

const ChatCard = ({ props }) => {
  const currentUser = useSelector((state) => state.userSlice);
  return (
    <div className="chat-card-wrapper">

      <div>
        {/* chat card left */}
        <div className="chat-img">
          <img src={props.img} alt="" />
        </div>

        {/* chat card CENTER */}
        <Stack
          direction="column"
          sx={{
            justifyContent: "space-evenly",
            alignItems: "left",
            overflow:"hidden",
          }}
        >
          <Typography variant="h6">{props.name}</Typography>
          <Typography variant="caption">{props.sender=currentUser.id?"You:":""} {props.lastMsg}</Typography>
        </Stack>
      </div>

      {/* chat card right */}
      <Stack
        direction="column"
        sx={{
          margin: "10px",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <Typography
          variant="caption text"
          sx={{
            marginBottom: "10px",
            color: "green",
          }}
        >
          {props.time}
        </Typography>
        <Typography variant="caption text" sx={{ marginBottom: "10px" }}>
          <Badge badgeContent={props.msgCount} color="primary"></Badge>
        </Typography>
      </Stack>
    </div>
  );
};

export default ChatCard;
