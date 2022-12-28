import { useContext, useEffect, useState } from "react";
import { ChanStyle } from "../../styles/channels";
import { ContextMenu } from "../../styles/menus";
import { DmStyle } from "../../styles/dms";
import { ChatContext } from "../../context/socketContext";
import AddChannel from "./addChannel";
import { Button, Modal } from "react-bootstrap";
import ReactCodeInput from "react-code-input";
import { UserContext } from "../../context/userContext";

const ChanEntry = ({ channel, show, points, selected }) => {
  const handleDelete = () => {};

  return (
    <ChanStyle color={selected === channel ? "lightgrey" : "white"}>
      {channel.type === "private" && show && (
        <ContextMenu top={points.y} left={points.x}>
          <ul>
            <li onClick={handleDelete}> Delete </li>
          </ul>
        </ContextMenu>
      )}
      {channel.name}
    </ChanStyle>
  );
};

export const DirectMessages = ({ directMessages, selected, setSelected }) => {
  return (
    <div className="dmWrapper">
      {directMessages &&
        directMessages.map((dm) => (
          <DmStyle
            color={selected === dm ? "lightgrey" : "white"}
            key={dm.name}
            className="dmEntry"
            onClick={() => {
              setSelected(dm);
            }}
          >
            {dm.name}
          </DmStyle>
        ))}
    </div>
  );
};

const PasswordDialog = ({ channel, setProtectedChan }) => {
  const socket = useContext(ChatContext);
  const user = useContext(UserContext);
  const [pass, setPass] = useState("");

  const handleAccept = () => {
    channel.password = pass;
    socket.emit("joinChannel", { channel, user });
    setProtectedChan(null);
  };

  return (
    <Modal show={true}>
      <div className="notif">
        <div className="header">
          <Modal.Title id="contained-modal-title-vcenter">
            {`Enter ${channel.name} password`}
          </Modal.Title>
        </div>
        <div className="body">
          <input onChange={(e) => setPass(e.target.value)} />
        </div>
        <div className="buttons">
          <Button variant="primary" onClick={handleAccept}>
            Confirm
          </Button>
          <Button variant="secondary" onClick={() => setProtectedChan(null)}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const Channel = ({ channel, selected, setSelected, setShowUsers }) => {
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [protectedChan, setProtectedChan] = useState(null);
  const socket = useContext(ChatContext);
  const user = useContext(UserContext);

  const handleClick = (channel) => {
    //socket.emit('joinChannel', chan);
    if (channel.type === "protected") {
      setProtectedChan(channel);
    } else {
      setSelected(channel);
      setShowUsers(true);
      socket.emit("joinChannel", { user, channel });
    }
  };

  useEffect(() => {
    window.addEventListener("click", () => {
      setShowContextMenu(false);
    });

    return () => {
      window.removeEventListener("click", () => {
        setShowContextMenu(false);
      });
    };
  }, []);

  return (
    <div>
      {channel &&
        channel.map((chan) => (
          <div
            key={chan.name}
            onContextMenu={(e) => {
              e.preventDefault();
              console.log(`${chan.name} clicked`);
              setShowContextMenu(true);
              setPoints({ x: e.pageX, y: e.pageY });
            }}
            onClick={() => handleClick(chan)}
          >
            <ChanEntry
              channel={chan}
              show={showContextMenu}
              points={points}
              selected={selected}
            />
          </div>
        ))}
      {protectedChan && (
        <PasswordDialog
          channel={protectedChan}
          setProtectedChan={setProtectedChan}
        />
      )}
    </div>
  );
};

export const Channels = ({
  privateChans,
  publicChans,
  selected,
  setSelected,
  setShowUsers,
}) => {
  const [showChanMenu, setShowChanMenu] = useState(false);

  return (
    <div className="aside">
      <h2> Channels </h2>
      <button onClick={() => setShowChanMenu(true)}> + </button>
      <h3 className="chanType"> Private </h3>
      <Channel
        channel={privateChans}
        selected={selected}
        setSelected={setSelected}
        setShowUsers={setShowUsers}
      />
      <h3 className="chanType"> Public </h3>
      <Channel
        channel={publicChans}
        selected={selected}
        setSelected={setSelected}
        setShowUsers={setShowUsers}
      />
      {showChanMenu && <AddChannel setShowChanMenu={setShowChanMenu} />}
    </div>
  );
};
