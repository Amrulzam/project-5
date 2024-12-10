import React, { useState, useEffect } from "react";
import "./Sender.css";
import { Box, Typography, Stack } from "@mui/material";
import { DotsThreeVertical,ArrowBendUpLeft, Copy, FolderUser,ArrowBendUpRight,Star,Backspace } from "@phosphor-icons/react";

const Sender = ({ props }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [type, setType] = useState(props?.type || "text");
  const [imgList, setImgList] = useState(props?.imgList || []);

  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);

  const moreOptions = [
    {
      icon:<ArrowBendUpLeft size={25} />,
      title:"Reply"
    },
    {
      icon:<Copy size={25} />,
      title:"Copy"
    },
    {
      icon:<FolderUser size={25} />,
      title:"Reply Privately"
    },
    {
      icon:<ArrowBendUpRight size={25} />,
      title:"Forward"
    },
    {
      icon:<Star size={25} />,
      title:"Star"
    },
    {
      icon:<Backspace size={25} />,
      title:"Delete"
    }
  ]

  return (
    <div className="sender-wrapper">
      <div className="sender-time">
        <ul
          style={{
            position: "absolute",
            listStyle: "none",
            top: "20px",
            width: "150px",
            backgroundColor: "rgb(146, 173, 183)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
          className={moreOptionsOpen ? "show" : "hide"}
        >
          {moreOptions.map((option, index) => (
            <li
              key={index}
              style={{ width: "100%", padding: "7px", cursor: "pointer" }}
              id="more-options"
              onClick={()=>{setMoreOptionsOpen(false)}}
            >
              <p
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                {option.icon}{" "}
                <span style={{ fontSize: "0.9rem", marginLeft: "10px" }}>
                  {option.title}
                </span>
              </p>
            </li>
          ))}
        </ul>
        <p>{props.time || "00:00"}</p>
      </div>

      <Box
        sx={{
          wdith: "auto",
          maxWidth: type === "text" ? "60%" : "50%",
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
            onClick={()=>{setMoreOptionsOpen(!moreOptionsOpen)}}
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
            maxWidth: type !== "pics" ? "100%" : "fit-content",
          }}
        >
          {type === "text" && (
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
          )}

          {type === "pics" && (
            <Box
              sx={{
                maxWidth: imgList.length < 3 ? "350px" : "600px",
                width: "auto",
              }}
            >
              <ul
                style={{
                  display: imgList.length < 2 ? "block" : "grid",
                  gridTemplateColumns:
                    imgList.length < 3 ? "1fr 1fr" : "1fr 1fr 1fr",
                  marginInline: "auto",
                }}
              >
                {imgList.map((img, index) => (
                  <li
                    key={index}
                    style={{
                      overflow: "hidden",
                      marginInline: "auto",
                      margin: "6px",
                    }}
                  >
                    <img
                      src={img}
                      alt={`Image ${index + 1}`}
                      width={
                        imgList.length < 2
                          ? "300px"
                          : imgList.length < 3
                          ? "200px"
                          : "150px"
                      }
                      height={
                        imgList.length < 2
                          ? "350px"
                          : imgList.length < 3
                          ? "230px"
                          : "140px"
                      }
                      style={{
                        transition: "transform 0.3s ease",
                        transform:
                          hoveredIndex === index ? "scale(1.1)" : "scale(1)",
                          borderRadius:"8px",
                      }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  </li>
                ))}
              </ul>
            </Box>
          )}

          {/* Optional Message Below Images */}
          {type !== "text" && props.msg && (
            <Typography
              sx={{
                width: "fit-content",
                marginTop: "10px",
                backgroundColor: "rgb(127, 148, 155)",
                padding: "5px",
                borderRadius: "6px",
                color: "white",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              {props.msg}
            </Typography>
          )}
        </Stack>
      </Box>

      <div className="sender-img">
        <img src={props.img} alt="Sender Profile" />
      </div>
    </div>
  );
};

export default Sender;
