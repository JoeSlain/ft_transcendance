import { channelType } from "./channelType";
import { userType } from "./userType";

export type notifType = {
  id: number;
  type: string;
  from: userType;
  to: userType;
  channel: channelType;
};
