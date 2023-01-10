import { useContext, useState } from "react";
import { ChatContext } from "../../context/socketContext";
import axios from "axios";
import User from "../../hooks/User";

export default function AddFriend() {
  const [name, setName] = useState("");
  const socket = useContext(ChatContext);
  const { user } = useContext(User);

  const addFriend = () => {
    axios
      .get(`http://localhost:3001/api/users/username/${name}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (!response.data) alert(`user ${name} not found`);
        else {
          socket.emit("notif", {
            type: "Friend Request",
            from: user,
            to: response.data,
            acceptEvent: "acceptFriendRequest",
          });
          setName("");
        }
      });
  };

  return (
    <div className="contactForm">
      <input
        className="contactFormInput"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addFriend} className="contactFormButton">
        {" "}
        +{" "}
      </button>
    </div>
  );
}
