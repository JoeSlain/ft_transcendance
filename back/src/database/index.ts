import { User } from "./entities/User";
import { TypeORMSession } from "./entities/Session";
import { Notif } from "./entities/Notif";
import { Channel } from "./entities/Channel";
import { ChanMessage } from "./entities/ChanMessage";
import { Game } from "./entities/Game;

export const entities = [User, TypeORMSession, Notif, Channel, ChanMessage, Game];

export { User, TypeORMSession, Notif, Channel, ChanMessage, Game };
