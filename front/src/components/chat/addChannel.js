import { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "../../styles/notif.css";
import "../../styles/addChannel.css";
import { UserContext } from "../../context/userContext";
import { ChatContext } from "../../context/socketContext";

const ChanInput = ({ title, chanEntry, setChanEntry }) => {
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

const ChanType = ({ setSelected }) => {
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

const AddChannel = ({ setShowChanMenu }) => {
  const [chanName, setChanName] = useState("");
  const [password, setPassword] = useState("");
  const [selected, setSelected] = useState("public");
  const socket = useContext(ChatContext);
  const user = useContext(UserContext);

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
