import React, { useContext, useState } from "react";
import { ChatContext } from "../../context/socketContext";
import axios from "axios";
import User from "../../hooks/User";

export default function AddFriend() {
  const [name, setName] = useState("");
  const socket = useContext(ChatContext);
  const { user } = useContext(User);

  const addFriend = (e: React.SyntheticEvent) => {
    e.preventDefault();
    axios
      .get(`http://10.11.7.11:3001/api/users/username/${name}`, {
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
        }
        setName("");
      });
  };

  return (
    <div className="pt-4">
      <div className="">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Search contact"
          className="input input-bordered input-primary w-full mt-2"
        />
        {/*           <input value={name} onChange={(e) => setName(e.target.value)} />
         */}{" "}
      </div>
      <div className="mt-2">
        <button onClick={addFriend} className="btn btn-circle">
          +
        </button>
        {/*           <button onClick={addFriend}> + </button>
         */}{" "}
      </div>
    </div>
  );
}
