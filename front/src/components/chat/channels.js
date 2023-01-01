import { useContext, useEffect, useState } from "react";
import { ChanStyle } from "../../styles/channels";
import { ContextMenu } from "../../styles/menus";
import { DmStyle } from "../../styles/dms";
import { ChatContext } from "../../context/socketContext";
import AddChannel from "./addChannel";
import { Button, Modal } from "react-bootstrap";
import ReactCodeInput from "react-code-input";
import { UserContext } from "../../context/userContext";
import PasswordDialog from "./passwordDialog";
import { ChanContextMenu, ChanEntry } from "./chanUtils";

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

const Channel = ({ channel, selected }) => {
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [contextChan, setContextChan] = useState(null);
  const [protectedChan, setProtectedChan] = useState(null);
  const socket = useContext(ChatContext);
  const user = useContext(UserContext);

  const handleClick = (e, channel) => {
    console.log(e.detail);
    if (e.detail === 2) {
      console.log("left click", channel);
      if (channel.type === "protected") {
        setProtectedChan(channel);
      } else socket.emit("joinChannel", { user, channel });
    }
  };

  useEffect(() => {
    window.addEventListener("click", () => {
      setContextChan(null);
    });

    return () => {
      window.removeEventListener("click", () => {
        setContextChan(null);
      });
    };
  }, []);

  return (
    <div>
      <ChanContextMenu
        channel={contextChan}
        setChannel={setContextChan}
        points={points}
      />
      {channel &&
        channel.map((chan) => (
          <div
            key={chan.id}
            onContextMenu={(e) => {
              e.preventDefault();
              console.log("right clicked", chan);
              setContextChan(chan);
              setPoints({ x: e.pageX, y: e.pageY });
            }}
            onClick={(e) => handleClick(e, chan)}
          >
            <ChanEntry channel={chan} selected={selected} />
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

export const Channels = ({ privateChans, publicChans, selected }) => {
  const [showChanMenu, setShowChanMenu] = useState(false);

  return (
    <div className="aside">
      <h2> Channels </h2>
      <button onClick={() => setShowChanMenu(true)}> + </button>

      <h3 className="chanType"> Private </h3>
      <Channel channel={privateChans} selected={selected} />
      <h3 className="chanType"> Public </h3>
      <Channel channel={publicChans} selected={selected} />

      {showChanMenu && <AddChannel setShowChanMenu={setShowChanMenu} />}
    </div>
  );
};
