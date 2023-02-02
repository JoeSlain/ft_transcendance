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
        "http://localhost:3001/api/auth/2fa/authenticate",
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
    <div className="center">
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="password"
          value={code}
          minLength={6}
          maxLength={6}
          onChange={(e) => setCode(e.target.value)}
          name={""}
          inputMode={"numeric"}
        />
        <button type="submit">login</button>
      </form>
    </div>
  );
}
