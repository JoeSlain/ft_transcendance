import React, { ReactNode } from "react";

type Props = {
  header: string;
  body: ReactNode;
};

const Modal: React.FC<Props> = ({ header, body }) => {
  console.log("modal");
  console.log("header", header);
  console.log("body", body);
  return (
    <div className="modalCss z-1">
      <div className="modalHeader ">{header}</div>
      {body}
    </div>
  );
};

export default Modal;
