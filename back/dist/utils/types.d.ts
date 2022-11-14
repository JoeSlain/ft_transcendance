import { User } from "src/database/entities/User";
export declare type Done = (err: Error, user: User) => void;
export declare type UserDetails = {
    username: string;
    id42: number;
};
