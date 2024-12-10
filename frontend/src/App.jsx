import "./App.css";
import Chat from "./pages/dashboards/Chat.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/login/Login.jsx';
import {io} from "socket.io-client";

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
      </Routes>
    </Router>
  );
}

export default App;
