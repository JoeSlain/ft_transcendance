import { useEffect } from "react";

type IProps = {
  selected: any;
  setSelected: (props: any) => void;
};

export default function useClickListener({ selected, setSelected }: IProps) {
  const handleClick = () => setSelected(null);

  useEffect(() => {
    setTimeout(() => {
      if (selected) {
        window.addEventListener("click", handleClick);
      }
    }, 0);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [selected]);
}
