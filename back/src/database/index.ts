import { User } from "./entities/User";
import { TypeORMSession } from "./entities/Session";
import { Notif } from "./entities/Notif";
import { Channel } from "./entities/Channel";
import { ChanMessage } from "./entities/ChanMessage";
import { Game } from "./entities/Game";
import { Restriction } from "./entities/Restriction";
import { DirectMessage } from "./entities/DirectMessages";
import { Conversation } from "./entities/Conversation";
import { Secret } from "./entities/Secret";

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
  Secret,
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
  Secret,
};
