import { chanMessageType } from "./chanMessageType";
import { userType } from "./userType";

export type channelType = {
  id: number;
  socketId: string;
  name: string;
  type: string;
  password?: string;
  owner: userType;
  users: userType[];
  admins: userType[];
  banned: userType[];
  muted: userType[];
  messages: chanMessageType[];
};
