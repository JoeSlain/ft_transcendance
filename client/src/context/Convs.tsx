import { createContext } from "react";
import { conversationType } from "../types/directMessageType";

type contextType = {
  convs: conversationType[];
  setConvs: (arg: conversationType[]) => void;
};

export const Convs = createContext<contextType>({
  convs: [],
  setConvs: () => {},
});
