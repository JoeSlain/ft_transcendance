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

type InputProps = {
  category: string;
  value: string;
  setValue: (value: string) => void;
};

const BanInput = ({ value, setValue, category }: InputProps) => {
  return (
    <>
      <input
        className="banInput"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="banCategory"> {category} </div>
    </>
  );
};

export default function BanUser({ channel, user }: Props) {
  const { setModal } = useContext(ModalContext);
  const [date, setDate] = useState(new Date());
  const socket = useContext(ChatContext);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (date <= new Date()) alert("invalid date");
    else {
      console.log("date", date);
      console.log("user", user);
      socket.emit("banUser", {
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
          <div className="dropDownTitle">Select ban time</div>
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
