import { useContext, useState } from "react";
import "../../styles/notif.css";
import "../../styles/addChannel.css";
import { ChatContext } from "../../context/socketContext";
import User from "../../hooks/User";

type AddChanProps = {
  setShowChanMenu: (show: boolean) => void;
};

type ChanInputProps = {
  title: string;
  chanEntry: string;
  setChanEntry: (chanEntry: string) => void;
};

type ChanTypeProps = {
  setSelected: (selected: string) => void;
};

const ChanInput = ({ title, chanEntry, setChanEntry }: ChanInputProps) => {
  return (
    <div className="notifEntry">
      <div className="entryTitle"> {title}: </div>
      <input
        className="entryInput"
        value={chanEntry}
        onChange={(e) => setChanEntry(e.target.value)}
      />
    </div>
  );
};

const ChanType = ({ setSelected }: ChanTypeProps) => {
  return (
    <>
      <div className="notifEntry">
        <div className="entryTitle">Type:</div>
        <select
          className="entryInput"
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="public">public</option>
          <option value="private">private</option>
        </select>
      </div>
    </>
  );
};

const AddChannel = ({ setShowChanMenu }: AddChanProps) => {
  const [chanName, setChanName] = useState("");
  const [password, setPassword] = useState("");
  const [selected, setSelected] = useState("public");
  const socket = useContext(ChatContext);
  const user = useContext(User);

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
    <Modal show={true}>
      <div className="notif">
        <div className="header">
          <Modal.Title id="contained-modal-title-vcenter">
            AddChannel
          </Modal.Title>
        </div>
        <div className="body">
          <ChanInput
            title="Name"
            chanEntry={chanName}
            setChanEntry={setChanName}
          />
          <ChanType setSelected={setSelected} />
          <ChanInput
            title="Password"
            chanEntry={password}
            setChanEntry={setPassword}
          />
        </div>
        <div className="buttons">
          <Button variant="primary" onClick={createChannel}>
            {" "}
            Create{" "}
          </Button>
          <Button variant="secondary" onClick={() => setShowChanMenu(false)}>
            {" "}
            Cancel{" "}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddChannel;
