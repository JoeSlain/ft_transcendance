import { UserDetails } from "src/utils/types";
export interface AuthenticationProvider {
    validateUser(details: UserDetails): any;
    createUser(details: UserDetails): any;
    findUser(id: number): any;
}
