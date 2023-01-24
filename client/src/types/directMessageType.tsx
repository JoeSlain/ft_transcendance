import { userType } from "./userType";

export type directMessageType = {
  content: string;
  from: userType;
};

export type conversationType = {
  id: number;
  to: userType;
  messages: directMessageType[];
  show: boolean;
};
