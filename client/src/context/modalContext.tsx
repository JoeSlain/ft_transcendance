import { createContext } from "react";
import { ModalType } from "../types/modalType";

type IProps = {
  setModal: (props: ModalType | null) => void;
};

export const ModalContext = createContext<IProps>({
  setModal: () => {},
});
