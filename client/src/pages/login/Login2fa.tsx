import axios from "axios";
import { useContext, useState } from "react";
import { ChatContext } from "../../context/socketContext";

export default function Login2fa() {
  const [code, setCode] = useState("");
  const socket = useContext(ChatContext);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    axios
      .post(
        "http://10.11.7.11:3001/api/auth/2fa/authenticate",
        { code },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data) socket.emit("login", response.data);
        else alert("code invalid");
        setCode("");
      });
  };

  return (
    <div className="twoFaContainer">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="twoFaLogin">
          <input
            type="password"
            placeholder="Enter google auth code"
            value={code}
            minLength={6}
            maxLength={6}
            onChange={(e) => setCode(e.target.value)}
            name={""}
            inputMode={"numeric"}
          />
          <button
            className="btn mt-2 normal-case text-slate-200 center"
            type="submit"
            style={{ width: 100 }}
          >
            login
          </button>
        </div>
      </form>
    </div>
  );
}
