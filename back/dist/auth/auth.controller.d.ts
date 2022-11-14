import { Request } from 'express';
export declare class AuthController {
    login(): void;
    redirect(req: any, res: any): Promise<void>;
    getProfile(request: Request): void;
}
