import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TwoFactorGuard extends AuthGuard('2fa') {}