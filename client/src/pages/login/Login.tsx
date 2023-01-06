import axios from "axios";
import "../../styles/global.css";
import "../../styles/login.css";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/socketContext";

export function VerifLogged() {
  return false;
}

export default function Login() {
  const [devlog, setDevLog] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const socket = useContext(ChatContext);

  const buttonAuth = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.location.assign("http://localhost:3001/api/auth/login");
    console.log("button de emrde");
  };

  const handleDevLogin = () => {
    axios
      .post(
        "http://localhost:3001/api/auth/devlog",
        {
          username,
          password: "password",
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("redirecting");
        socket.emit("login", response.data);
      });
  };

  if (devlog) {
    return (
      <div className="center">
        <div className="form">
          <div className="formInput">
            <div className="formInputName"> Username </div>
            <input
              className="formInputValue"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="formButtons">
            <button className="button-auth" onClick={handleDevLogin}>
              {" "}
              Connect{" "}
            </button>
            <button
              className="button-auth"
              onClick={() => {
                setUsername("");
                setDevLog(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="back">
        <div className="titre">
          <p>TRANSCENDANCE </p>
          <p>Play for fun on PongGame </p>
        </div>

        <div>
          <button onClick={buttonAuth} className="button-auth" name="button 1">
            Connect with 42
          </button>
          <button onClick={() => setDevLog(true)} className="button-auth">
            Dev connect
          </button>
        </div>
      </div>
    );
  }
}
