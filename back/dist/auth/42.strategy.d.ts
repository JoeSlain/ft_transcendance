import { Profile } from 'passport-42';
declare const FortyTwoStrategy_base: any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: Profile): unknown;
}
export {};
