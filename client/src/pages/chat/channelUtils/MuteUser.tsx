import React, { useContext, useState } from "react";
import { ModalContext } from "../../../context/modalContext";
import { channelType } from "../../../types/channelType";
import { userType } from "../../../types/userType";
import DatePicker from "react-datepicker";
import "../../../styles/chat/channelUsersBar.css";
import "react-datepicker/dist/react-datepicker.css";
import { ChatContext } from "../../../context/socketContext";

type Props = {
  channel: channelType;
  user: userType;
};

export default function MuteUser({ channel, user }: Props) {
  const { setModal } = useContext(ModalContext);
  const [date, setDate] = useState(new Date());
  const socket = useContext(ChatContext);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (date <= new Date()) alert("invalid date");
    else {
      console.log("date", date);
      console.log("user", user);
      socket.emit("muteUser", {
        user,
        channel,
        date,
      });
      setModal(null);
    }
  };

  return (
    <form className="modalForm" onSubmit={handleSubmit}>
      <div className="modalBody">
        <div className="banModal">
          <div className="dropDownTitle">Select mute time</div>
          <DatePicker selected={date} onChange={(d: Date) => setDate(d)} />
        </div>
      </div>
      <div className="modalButtons">
        <button type="submit" className="modalButton">
          Confirm
        </button>
        <button className="modalButton" onClick={() => setModal(null)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
