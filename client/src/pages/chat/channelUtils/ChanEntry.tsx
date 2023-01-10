import { channelType } from "../../../types/channelType";

type Props = {
  channel: channelType;
  selected: channelType | null;
};

export default function ChanEntry({ channel, selected }: Props) {
  const isSelected = selected && selected.id === channel.id;
  const color = isSelected ? "lightgrey" : "white";

  return (
    <div className="chanEntry" style={{ color }}>
      {channel.name}
    </div>
  );
}
