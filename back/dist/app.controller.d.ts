import { AuthService } from './auth/auth.service';
export declare class AppController {
    private authService;
    constructor(authService: AuthService);
    login(): void;
    redirect(req: any, res: any): any;
    getProfile(req: any): any;
}
