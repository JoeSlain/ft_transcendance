import { useContext, useEffect } from "react";
import { GameContext } from "../../context/socketContext";
import { CountdownType } from "../../context/countDownContext";

type Props = {
  countdown: CountdownType | null;
  setCountdown: (countdown: CountdownType | null) => void;
};

export default function useQueueEvents({ countdown, setCountdown }: Props) {
  const socket = useContext(GameContext);

  useEffect(() => {
    socket.on("stopQueue", () => {
      console.log("stop queue");
      setCountdown(null);
    });

    return () => {
      socket.off("stopQueue");
    };
  }, []);

  useEffect(() => {
    if (countdown) {
      const interval = setInterval(() => {
        let min = countdown.min;
        let sec = countdown.sec + 1;
        if (sec === 60) {
          min += 1;
          sec = 0;
        }
        setCountdown({ min, sec });
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [countdown]);
}
