import React, { useEffect, useState } from "react";
import { Stack, Box, IconButton, Typography } from "@mui/material";
import { MagnifyingGlass, Archive } from "@phosphor-icons/react";
import { useSelector, useDispatch } from "react-redux";
import { setChatting } from "../features/chattingSlice";

import ChatCard from "./chatCard/ChatCard";
import axios from "axios";
import {DateTime} from 'luxon';

const Chats = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const currentUser = useSelector((state) => state.userSlice);

  const handleClick = async (name, state, img, id) => {
    let messages = [];
    try {
      const res = await axios.post("http://localhost:4002/message/get", {
        SENDER_ID: currentUser.id,
        RECEIVER_ID: id,
      });
      messages = res.data.data;
      console.log(messages);
    } catch (err) {
      console.error("Error getting messages:", err);
    }

    dispatch(
      setChatting({
        userName: name,
        userState: state,
        userImg: img,
        userId: id,
        userMessages: messages,
      })
    );
  };

  useEffect(() => {
    setLoading(true);
     console.log("Effect triggered!");
    axios
      .post(`http://localhost:4002/conversations/${currentUser.id}`)
      .then((res) => {
        console.log("Conversations received");
        setConversations(res.data.conversations);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error receiving conversations:", err);
        setLoading(false);
      });
  }, [currentUser.id]);

  if (loading) {
    return <Typography>Loading conversations...</Typography>;
  }

  if (!loading && conversations.length === 0) {
    return <Typography>No conversations found.</Typography>;
  }

  return (
    <div className="chats-wrapper">
      <Stack
        direction="column"
        sx={{
          width: "100%",
          borderRight: 0.3,
          minWidth: "330px",
          height: "100vh",
          alignItems: "center",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              marginTop: 0,
              marginBottom: "10px",
            }}
          >
            Chats
          </Typography>

          <Box sx={{ width: "100%", marginInline: "auto" }}>
            <Stack
              direction="row"
              sx={{
                width: "max-content",
                border: 0.3,
                borderRadius: 5,
                height: "40px",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingLeft: "15px",
                overflow: "hidden",
              }}
            >
              <MagnifyingGlass size={25} />
              <input
                type="text"
                style={{
                  height: "inherit",
                  border: "none",
                  fontSize: "1.2rem",
                  paddingLeft: "10px",
                  backgroundColor: "transparent",
                }}
                placeholder="Search"
                onFocus={(e) => {
                  e.target.style.outline = "none";
                }}
              />
            </Stack>
          </Box>
        </Box>

        <Box sx={{ width: "90%", marginBottom: "10px" }}>
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <IconButton>
              <Archive size={25} />
            </IconButton>
            <Typography variant="subtitle2" sx={{ cursor: "pointer" }}>
              Archives
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ width: "90%" }}>
          <Stack direction="column" sx={{ width: "100%" }}>
            {conversations.map((conn, index) => (
              <div
                key={conn.ID}
                onClick={() =>
                  handleClick(
                    conn.RECEIVER_NAME,
                    conn.RECEIVER_STATE || "online",
                    conn.RECEIVER_IMG || "assets/pic1.jpg",
                    conn.RECEIVER_ID
                  )
                }
              >
                <ChatCard
                  props={{
                    img: conn.RECEIVER_IMG || "assets/pic1.jpg",
                    name: conn.RECEIVER_NAME,
                    lastMsg: conn.MESSAGE,
                    msgCount: 1,
                    time: `${DateTime.fromISO(conn.TIME_STAMP).toFormat('HH:mm a')}`,
                    sender:conn.SENDER_ID
                  }}
                />
              </div>
            ))}
          </Stack>
        </Box>
      </Stack>
    </div>
  );
};

export default Chats;
