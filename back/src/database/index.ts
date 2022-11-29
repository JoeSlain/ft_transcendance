import { User } from "./entities/User";
import { TypeORMSession } from "./entities/Session";
import { Notif } from "./entities/Notif";

export const entities = [User, TypeORMSession, Notif];

export { User, TypeORMSession, Notif };