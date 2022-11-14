import { User } from "./entities/User";
import { TypeORMSession } from "./entities/Session";
export declare const entities: (typeof TypeORMSession | typeof User)[];
export { User, TypeORMSession };
