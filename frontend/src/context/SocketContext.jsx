import React, { createContext, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();
const socket = io.connect("http://localhost:4002");

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
