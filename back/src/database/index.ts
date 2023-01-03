import { User } from "./entities/User";
import { TypeORMSession } from "./entities/Session";
import { Notif } from "./entities/Notif";
import { Channel } from "./entities/Channel";
import { ChanMessage } from "./entities/ChanMessage";

export const entities = [User, TypeORMSession, Notif, Channel, ChanMessage];

export { User, TypeORMSession, Notif, Channel, ChanMessage };
