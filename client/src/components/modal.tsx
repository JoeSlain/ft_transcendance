import React, { ReactNode } from "react";

type Props = {
  header: string;
  body: ReactNode;
};

const Modal: React.FC<Props> = ({ header, body }) => {
  return (
    <div className="modal">
      <div className="modalHeader">{header}</div>
      {body}
    </div>
  );
};

export default Modal;
