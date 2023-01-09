import { useContext, useState } from "react";
import { ChatContext } from "../../../context/socketContext";
import User from "../../../hooks/User";

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
      <input
        className="inputEntry"
        value={chanEntry}
        onChange={(e) => setChanEntry(e.target.value)}
      />
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

const AddChannel = ({ setShowChanMenu }: AddChanProps) => {
  const [chanName, setChanName] = useState("");
  const [password, setPassword] = useState("");
  const [selected, setSelected] = useState("public");
  const socket = useContext(ChatContext);
  const { user } = useContext(User);

  const createChannel = () => {
    const newChan = {
      name: chanName,
      type: selected,
      owner: user,
      password,
    };
    socket.emit("createChannel", newChan);
    setShowChanMenu(false);
  };

  return (
    <div className="modal">
      <div className="modalHeader">AddChannel</div>
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
        <button className="modalButton" onClick={createChannel}>
          {" "}
          Create{" "}
        </button>
        <button className="modalButton" onClick={() => setShowChanMenu(false)}>
          {" "}
          Cancel{" "}
        </button>
      </div>
    </div>
  );
};

export default AddChannel;
