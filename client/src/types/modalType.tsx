import { ReactNode } from "react";

export type ModalType = {
  header: string;
  body: string | ReactNode;
  //handleAccept: () => void;
};
