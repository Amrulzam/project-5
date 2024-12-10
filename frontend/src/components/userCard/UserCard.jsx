import React from "react";
import "./UserCard.css";
import { Stack, Box,Typography } from "@mui/material";

const UserCard = ({ props }) => {
  return (
    <div className="user-card-wrapper">
      <div>
        {/* user card left */}
        <div className="user-img">
          <img src={props.img} alt="" />
        </div>

        {/* user card middle */}
        <Stack
          direction="column"
          sx={{
            justifyContent: "space-evenly",
            alignItems: "left",
            overflow: "hidden",
          }}
        >
          <Typography variant="h6">{props.name}</Typography>
          <Typography variant="caption">{props.desc}</Typography>
        </Stack>
      </div>
    </div>
  );
};

export default UserCard;
