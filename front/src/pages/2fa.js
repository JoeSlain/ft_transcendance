import axios from "axios";
import { useContext, useState } from "react";
import ReactCodeInput from "react-code-input";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../context/socketContext";

const TwoFa = () => {
  const [code, setCode] = useState("");
  const socket = useContext(ChatContext);

  const getCode = (code) => {
    console.log(code);
    setCode(code);
  };

  const send2faCode = (event) => {
    event.preventDefault();
    axios
      .post(
        "http://localhost:3001/api/auth/2fa/authenticate",
        {
          twoFactorAuthenticationCode: code,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("2fa login");
        socket.emit("login", response.data);
      });
  };

  return (
    <div>
      {
        <div>
          <p> Enter code from GoogleAuthenticator app </p>
          <form onSubmit={send2faCode}>
            <ReactCodeInput type="text" fields={6} onChange={getCode} />
            <button type="submit"> confirm </button>
          </form>
        </div>
      }
    </div>
  );
};

export default TwoFa;
