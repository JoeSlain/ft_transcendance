import { User } from "./entities/User";
import { TypeORMSession } from "./entities/Session";
export declare const entities: (typeof User | typeof TypeORMSession)[];
export { User, TypeORMSession };
