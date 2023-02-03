import axios from "axios";
import React, { useContext, useState } from "react";
import User from "../../../hooks/User";
import { channelType } from "../../../types/channelType";
import { ChatContext } from "../../../context/socketContext";

type Props = {
  selected: channelType;
};

export default function AddChanUser({ selected }: Props) {
  const [name, setName] = useState("");
  const socket = useContext(ChatContext);
  const { user } = useContext(User);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    axios
      .get(`http://10.11.7.11:3001/api/users/username/${name}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data) {
          console.log("sending chan", selected);
          socket.emit("chanInvite", {
            type: `Chan Invite ${selected.name}`,
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
    <form onSubmit={handleSubmit} className="contactForm">
      <input
        className="contactFormInput"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="contactFormButton" type="submit">
        {" "}
        +{" "}
      </button>
    </form>
  );
}
