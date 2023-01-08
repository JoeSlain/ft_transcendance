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
