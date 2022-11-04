import { Profile } from 'passport-42';
declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    constructor();
    validate(acessToken: string, refreshToken: string, profile: Profile): Promise<void>;
}
export {};
