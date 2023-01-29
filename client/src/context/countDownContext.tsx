import { createContext } from "react";

type IProps = {
  countdown: CountdownType | null;
  setCountdown: (countdown: CountdownType | null) => void;
};

export type CountdownType = {
  sec: number;
  min: number;
};

export const CountdownContext = createContext<IProps>({
  countdown: { sec: 0, min: 0 },
  setCountdown: () => {},
});
