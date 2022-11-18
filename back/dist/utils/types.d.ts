import { User } from "src/database/entities/User";
export declare type Done = (err: Error, user: User) => void;
export declare type UserDetails = {
    username: string;
    email: string;
    id42: number;
    img_url: string;
};
