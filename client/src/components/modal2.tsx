import React, { ReactNode, ReactPropTypes } from "react";

type Props = {
  show: boolean;
  setShow: (show: boolean) => void;
  header: string;
  children: ReactNode;
};

export default function Modal({ show, setShow, header, children }: Props) {
  if (show) {
    return (
      <div className="modal">
        <div className="modalHeader">{header}</div>
        <div className="modalBody">{children}</div>
      </div>
    );
  }
}
