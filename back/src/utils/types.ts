import { Channel } from "diagnostics_channel";
import { string } from "joi";
import { User } from "src/database/entities/User";

// done type for serializer
export type Done = (err: Error, user: User) => void;

// user details for db query
export type UserDetails = {
  username: string;
  email: string;
  id42: number;
  img_url: string;
};

// notif type
export type NotifData = {
  type: string;
  from: User;
  to: User;
  channel?: Channel;
};

export type RoomUser = {
  infos: User;
  ready: boolean;
};

// room type
export type Room = {
  id: string;
  host: RoomUser;
  guest: RoomUser;
  spectators: Array<User>;
  gameStarted: boolean;
};

// channel type
export type ChannelData = {
  name: string;
  type: string;
  password?: string;
  owner: User;
};
