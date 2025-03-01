import React, { useEffect, useState } from "react";
import "./Users.css";
import { Stack, Box, Typography } from "@mui/material";
import UserCard from "../userCard/UserCard";
import { MagnifyingGlass, Archive } from "@phosphor-icons/react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setChatting,setDefault } from "../../features/chattingSlice";

const Users = () => {
  const currentUser = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (currentUser.email) {
      axios
        .get(`http://localhost:4002/dashboards/${currentUser.email}`)
        .then((res) => {
          setUsers(res.data.info);
          console.log("got users");
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
        });
    }
  }, [currentUser.email]);

  const handleClick = async (name, state, img, id) => {

    let messages;
    await axios.post("http://localhost:4002/message/get",{
      SENDER_ID:currentUser.id,
      RECEIVER_ID: id
    }).then((res)=>{
      messages= res.data.data;
      console.log(messages);
    }).catch((err)=>{
      console.log("Error getting Messages : "+err);
    })

    //dispatch(setDefault());
    dispatch(
      setChatting({
        userName: name,
        userState: state,
        userImg: img,
        userId: id,
        userMessages:messages,
      })
    );
  };

  return (
    <div className="users-wrapper">
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
          <p
            style={{
              fontSize: "min(5vw,1.9rem)",
              fontWeight: 600,
              marginTop: 0,
              marginBottom: "10px",
            }}
          >
            Users
          </p>

          <Box
            sx={{
              /* search input */ width: "100%",
              marginInline: "auto",
            }}
          >
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
              <MagnifyingGlass size={25} height="inherit" />
              <Box
                sx={{
                  height: "inherit",
                }}
              >
                <input
                  type="text"
                  style={{
                    height: "inherit",
                    border: "none",
                    fontSize: "1.2rem",
                    paddingLeft: "10px",
                    backgroundColor: "trsnsperant",
                    marginBottom: "10px",
                  }}
                  placeholder="Search"
                  onFocus={(e) => {
                    e.target.style.outline = "none";
                  }}
                />
              </Box>
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            width: "90%",
            marginTop: "10px",
          }}
        >
          <Stack
            direction="column"
            sx={{
              width: "100%",
              justifyContent: "flex-start",
            }}
          >
            {/* {users.length > 0 ? (
              users.map((user) => (
                <UserCard
                  key={user.ID}
                  props={{
                    img:"assets/pic4.jpg",
                    name: `${user.F_NAME} ${user.L_NAME}`,
                    desc: user.DESC || "~",
                  }}
                />
              ))
            ) : (
              <Typography
                variant="body1"
                sx={{ textAlign: "center", marginTop: 2 }}
              >
                No users found.
              </Typography>
            )} */}
            {users.map((user) => (
              <Box
                onClick={() => {
                  handleClick(
                    `${user.F_NAME} ${user.L_NAME}`,
                    "online",
                    "",
                    user.ID
                  );
                }}
              >
                <UserCard
                  key={user.ID}
                  props={{
                    img: "assets/pic4.jpg",
                    name: `${user.F_NAME} ${user.L_NAME}`,
                    desc: user.DESC || "~",
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </div>
  );
};

export default Users;
