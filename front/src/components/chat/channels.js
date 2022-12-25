import { useContext, useEffect, useState } from "react";
import { ChanStyle } from "../../styles/channels";
import { ContextMenu } from "../../styles/menus";
import { DmStyle } from "../../styles/dms";
import { ChatContext } from "../../context/socketContext";

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

export const Channel = ({ channel, selected, setSelected, setShowUsers }) => {
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const socket = useContext(ChatContext);

  useEffect(() => {
    window.addEventListener("click", () => {
      setShow(false);
    });

    return () => {
      window.removeEventListener("click", () => {
        setShow(false);
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
              console.log("show in div", show);
              setShow(true);
              setPoints({ x: e.pageX, y: e.pageY });
            }}
            onClick={() => {
              //socket.emit('joinChannel', chan);
              setSelected(chan);
              setShowUsers(true);
            }}
          >
            <ChanEntry
              channel={chan}
              show={show}
              points={points}
              selected={selected}
            />
          </div>
        ))}
    </div>
  );
};

export const Channels = ({
  privateChans,
  publicChans,
  selected,
  setSelected,
  setShowChanMenu,
  setShowUsers,
}) => {
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
    </div>
  );
};
