import { User } from "src/users/users.service";

export type Done = (err: Error, user: User) => void;