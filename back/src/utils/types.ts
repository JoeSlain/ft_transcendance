import { string } from "joi";
import { Channel } from "src/database";
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

// notif data
export type NotifData = {
  type: string;
  from: User;
  to: User;
  acceptEvent: string;
  channel?: Channel;
};

// room user
export type RoomUser = {
  infos: User;
  ready: boolean;
};

// room
export type Room = {
  id: string;
  host: RoomUser;
  guest: RoomUser;
  spectators: Array<User>;
  gameStarted: boolean;
};

// channel data
export type ChannelData = {
  name: string;
  type: string;
  password?: string;
  owner: User;
};

// message data
export type MessageData = {
  content: string;
  from?: User;
  channel: any;
};
