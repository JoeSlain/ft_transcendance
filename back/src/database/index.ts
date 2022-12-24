import { User } from "./entities/User";
import { TypeORMSession } from "./entities/Session";
import { Notif } from "./entities/Notif";
import { Channel } from "./entities/Channel";
import { Message } from "./entities/Message";

export const entities = [User, TypeORMSession, Notif, Channel, Message];

export { User, TypeORMSession, Notif, Channel, Message };
