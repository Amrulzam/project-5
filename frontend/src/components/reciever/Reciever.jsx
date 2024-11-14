import React from "react";
import "./Reciever.css";
import { Typography, Box } from "@mui/material";

const Reciever = ({ props }) => {
  return (
    <div className="reciever-wrapper">
      <div className="reciever-img">
        <img src={props.img} alt="" />
      </div>
      <Box
        sx={{
          maxwidth: "60%",
          width: "auto",
          marginTop: "15px",
          marginLeft: "10px",
          marginRight: "10px",
          padding: "7px",
          borderRadius: "8px",
          height: "fit-content",
          backgroundColor: "rgb(127, 148, 155)",
          color: "whitesmoke",
        }}
      >
        <Typography
          sx={{
            height: "auto",
            wordBreak: "break-word",
            overflowWrap: "break-word" /* Break lines within words */,
            whiteSpace: "pre-wrap",
          }}
        >
          {props.msg}
        </Typography>
      </Box>
      <div className="reciever-time">
        <p>{props.time}</p>
      </div>
    </div>
  );
};

export default Reciever;
