import { useEffect } from "react";

type IProps = {
  show: boolean;
  setShow: (props: boolean) => void;
};

export default function useClickListener({ show, setShow }: IProps) {
  const handleClick = () => setShow(false);

  useEffect(() => {
    setTimeout(() => {
      if (show) {
        window.addEventListener("click", handleClick);
      }
    }, 0);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [show]);
}
