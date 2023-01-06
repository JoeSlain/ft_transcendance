import { channelType } from "./channelType";
import { userType } from "./userType";

export type chanMessageType = {
  id: number;
  content: string;
  channel: channelType;
  from: userType;
};
