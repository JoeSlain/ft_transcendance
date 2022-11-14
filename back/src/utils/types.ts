import { User } from "src/database/entities/User";

// done type for serializer
export type Done = (err: Error, user: User) => void;

// user details for db query
export type UserDetails = {
    username: string;
    email: string;
    id42: number;
}