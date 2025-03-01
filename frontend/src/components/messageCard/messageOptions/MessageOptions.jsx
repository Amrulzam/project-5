import React, { forwardRef } from "react";
import './MessageOptions.css';
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

const MessageOptions = forwardRef(({props},ref) => {

  return (
      <div
        style={{
          position: "absolute",
          top: "45px",
          width: "180px",
          maxHeight: "420px",
          height: "fit-content",
          backgroundColor: "rgb(146, 173, 183)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
        className={props.moreOptionsOpen ? "show message-options-wrapper" : "hide message-options-wrapper"}
        ref={ref}
      >
        {props.moreOptions.map((option, index) => (
          <div
            key={index}
            style={{ width: "100%", padding: "6px", cursor: "pointer" }}
            id="more-options"
            onClick={() => {
              props.setMoreOptionsOpen(false);
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
              <span style={{ fontSize: "1rem", marginLeft: "10px" }}>
                {option.title}
              </span>
            </p>
          </div>
        ))}
      </div>
  );
});

export default MessageOptions;
