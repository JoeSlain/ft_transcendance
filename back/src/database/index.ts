import { User } from "./entities/User";
import { TypeORMSession } from "./entities/Session";
import { Notif } from "./entities/Notif";
import { Channel } from "./entities/Channel";
import { ChanMessage } from "./entities/ChanMessage";
import { Game } from "./entities/Game";
import { Restriction } from "./entities/Restriction";
import { DirectMessage } from "./entities/DirectMessages";
import { Conversation } from "./entities/Conversation";

export const entities = [
  User,
  TypeORMSession,
  Notif,
  Channel,
  ChanMessage,
  Game,
  Restriction,
  DirectMessage,
  Conversation,
];

export {
  User,
  TypeORMSession,
  Notif,
  Channel,
  ChanMessage,
  Game,
  Restriction,
  DirectMessage,
  Conversation,
};
