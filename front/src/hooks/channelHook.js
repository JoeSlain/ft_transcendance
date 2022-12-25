import { useState } from "react";

export default function useChannels() {
  const [channels, setChannels] = useState({
    privateChans: [],
    publicChans: [],
  });

  return channels;
}
