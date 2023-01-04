import { userType } from "./userType";

export type roomUser = {
  infos: userType;
  ready: boolean;
};

export type roomType = {
  id: number;
  guest: roomUser;
  host: roomUser;
  spectators: userType[];
  gameStarted: boolean;
};
