import axios from "axios";
import { useContext, useState } from "react";
import User from "../../../hooks/User";
import { channelType } from "../../../types/channelType";
import { ChatContext } from "../../../context/socketContext";

type Props = {
  selected: channelType | null;
};

export default function AddChanUser({ selected }: Props) {
  const [name, setName] = useState("");
  const socket = useContext(ChatContext);
  const { user } = useContext(User);

  const handleSubmit = () => {
    axios
      .get(`http://localhost:3001/api/users/username/${name}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data) {
          console.log("sending chan", selected);
          socket.emit("chanInvite", {
            type: "Chan Invite",
            from: user,
            to: response.data,
            channel: selected,
            acceptEvent: "acceptChannelInvite",
          });
        } else alert("user not found");
      });
    setName("");
  };

  return (
    <div className="contactForm">
      <input
        className="contactFormInput"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="contactFormButton" onClick={handleSubmit}>
        {" "}
        +{" "}
      </button>
    </div>
  );
}
