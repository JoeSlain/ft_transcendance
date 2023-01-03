import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/socketContext";

const AddFriend = ({ me, friends, setFriends }) => {
  const [name, setName] = useState("");
  const socket = useContext(ChatContext);

  const notify = (user) => {
    const data = {
      type: "Friend Request",
      from: me,
      to: user,
    };
    console.log("data", data);
    socket.emit("notif", data);
  };

  const addFriend = (e) => {
    e.preventDefault();

    if (name === "") {
      alert("invalid username");
    } else {
      axios
        .get(`http://localhost:3001/api/users/username/${name}`, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data) notify(response.data);
          else alert("invalid username");
        });
    }
    setName("");
  };

  const handleNewName = (e) => {
    setName(e.target.value);
  };

  return (
    <div className="addFriend">
      <h2> Friends </h2>
      <form onSubmit={addFriend}>
        <div className="form">
          <div className="form_input">
            <input value={name} onChange={handleNewName} />
          </div>
          <button type="submit"> + </button>
        </div>
      </form>
    </div>
  );
};

export default AddFriend;
