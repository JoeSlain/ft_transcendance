import { channelType } from "./channelType";
import { userType } from "./userType";

export type notifType = {
  id: number;
  type: string;
  from: userType;
  to: userType;
  acceptEvent: string;
  declineEvent?: string;
  channel?: channelType;
};
