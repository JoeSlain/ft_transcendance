import { ISession } from "connect-typeorm";
export declare class TypeORMSession implements ISession {
    expiredAt: number;
    id: string;
    json: string;
}
