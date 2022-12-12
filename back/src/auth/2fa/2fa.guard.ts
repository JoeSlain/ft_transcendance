import { AuthGuard } from "@nestjs/passport";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class TwoFactorGuard extends AuthGuard("2fa") {}
