import React, { useContext, useState } from "react";
import { ChatContext } from "../../../context/socketContext";
import User from "../../../hooks/User";
import { ModalContext } from "../../../context/modalContext";
import validateUserInput from "../../../services/zod/validateUserInput";
import Error from "../../../components/error";

type AddChanProps = {
  setShowChanMenu: (show: boolean) => void;
};

type ChanInputProps = {
  title: string;
  chanEntry: string;
  setChanEntry: (chanEntry: string) => void;
};

type DropDownProps = {
  setSelected: (selected: string) => void;
};

const ChanInput = ({ title, chanEntry, setChanEntry }: ChanInputProps) => {
  return (
    <div className="addChanInput">
      <div className="inputTitle"> {title} </div>
      {title === 'Password' ? <input
        className="inputEntry"
        type='password'
        value={chanEntry}
        onChange={(e) => setChanEntry(e.target.value)}
      /> : <input
        className="inputEntry"
        value={chanEntry}
        onChange={(e) => setChanEntry(e.target.value)}
      />
      }

    </div>
  );
};

const DropDown = ({ setSelected }: DropDownProps) => {
  return (
    <div className="addChanInput">
      <div className="inputTitle">Type</div>
      <select
        className="inputEntry"
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="public">public</option>
        <option value="private">private</option>
        <option value="protected">protected</option>
      </select>
    </div>
  );
};

const AddChannel = () => {
  const [chanName, setChanName] = useState("");
  const [password, setPassword] = useState("");
  const [selected, setSelected] = useState("public");
  const socket = useContext(ChatContext);
  const { user } = useContext(User);
  const { setModal } = useContext(ModalContext);

  const createChannel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const res = validateUserInput(chanName);
    if (res.res === false || chanName === "") {
      setModal({
        header: "Error",
        body: (
          <div className="flex flex-col justify-center items-center gap-5">
            <Error err={"Wrong channel name"} />{" "}
            <button
              className="btn btn-primary gap-2 normal-case max-w-[50%] lg:gap-3 "
              onClick={() => setModal(null)}
            >
              {" "}
              Cancel{" "}
            </button>
          </div>
        ),
      });
      return;
    }
    const newChan = {
      name: chanName,
      type: selected,
      owner: user,
      password,
    };
    socket.emit("createChannel", newChan);
    setModal(null);
  };

  return (
    <form className="modalForm" onSubmit={createChannel}>
      <div className="modalBody">
        <ChanInput
          title="Name"
          chanEntry={chanName}
          setChanEntry={setChanName}
        />
        <DropDown setSelected={setSelected} />
        {selected === "protected" && (
          <ChanInput
            title="Password"
            chanEntry={password}
            setChanEntry={setPassword}
          />
        )}
      </div>
      <div className="modalButtons">
        <button className="modalButton" type="submit">
          {" "}
          Create{" "}
        </button>
        <button className="modalButton" onClick={() => setModal(null)}>
          {" "}
          Cancel{" "}
        </button>
      </div>
    </form>
  );
};

export default AddChannel;
