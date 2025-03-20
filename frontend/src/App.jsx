import "./App.css";
import Chat from "./pages/dashboards/Chat.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import { io } from "socket.io-client";
import OtpVerification from "./pages/otpVerification/OtpVerification.jsx";
import ChangePassword from "./pages/changePassword/ChangePassword.jsx";

function App() {
  const socket = io("http://localhost:4002");
  return (
    <Router>
      <Routes>
        <Route
          path="/dashboards"
          element={
            <div className="app-wrapper">
              <Chat />
            </div>
          }
        />
        <Route
          path="/"
          element={
            <div className="app-wrapper">
              <Login />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div className="app-wrapper">
              <Login />
            </div>
          }
        />

        <Route
          path="/verify_otp/:email"
          element={
            <div className="app-wrapper">
              <OtpVerification />
            </div>
          }
        />

        <Route
          path="/verify_otp/:email/passwords"
          element={
            <div className="app-wrapper">
              <ChangePassword />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
