const express = require("express");
const { createServer } = require("node:http");
const cors = require("cors");
const helmet = require("helmet");
const { login, register, getAll } = require("./controllers/auth");
const verifyRoute = require("./routes/verifyRoute");
const messageRoute = require("./routes/messageRoute");
const conversationRoute = require('./routes/conversationRoute');
const { Socket, Server } = require("socket.io");

const app = new express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(helmet());
app.use(express.json());

const users = {};
io.on("connection", (socket) => {
  console.log("user connected:: " + socket.id + socket.handshake.address);
  socket.on("disconnect", () => {
    console.log("user disconnected " + socket.id);
  });

  /* socket.on("send_message",(data)=>{
    socket.broadcast.emit("recieve_message",data);
   }); */
  socket.on("register", (userId) => {
    users[userId] = socket.id;
    socket.userId = userId; // Set userId on the socket object
    console.log("User registered: " + userId);
  });

  socket.on("sendMessageToUser", ({ receiverId: targetUserId, messageData: data }) => {
    console.log("Target User ID:", targetUserId);
    console.log("Users:", users);
    const targetSocketId = users[targetUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("privateMessage", data);
      console.log("Message sent to user:", targetUserId);
    } else {
      console.log(`User ${targetUserId} not found`);
    }
  });

});

app.use("/verify", verifyRoute);
app.use("/message", messageRoute);
app.use('/conversations', conversationRoute);

app.post("/login", login);
app.post("/register", register);
app.get("/dashboards/:email", getAll);

server.listen(4002, () => {
  console.log("Listening on port 4002");
});
