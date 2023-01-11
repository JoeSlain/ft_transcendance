import { useState } from "react";

export default function useModal() {
  const [show, setShow] = useState(false);

  function toggle() {
    setShow(!show);
  }

  return {
    show,
    setShow,
  };
}
