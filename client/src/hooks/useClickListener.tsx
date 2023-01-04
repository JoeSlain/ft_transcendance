import { useEffect } from "react";

export default function useClickListener(
  setShowContext: (props: boolean) => void
) {
  useEffect(() => {
    const handleClick = () => setShowContext(false);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);
}
