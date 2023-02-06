import { Injectable } from "@nestjs/common";
import { User } from "src/database";
import { authenticator } from "otplib";
import { UsersService } from "src/users/users.service";
import { toFileStream } from "qrcode";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.email,
      "transcendence2fa",
      secret
    );

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
    return { otpauthUrl };
  }

  async pipeQrCodeStream(stream, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  async isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: User
  ) {
    const userWithSecret = await this.usersService.getUserWithSecret(user.id);
    console.log("user", user);
    console.log("userWithSecret", userWithSecret);

    console.log("code valid code", twoFactorAuthenticationCode);
    console.log("user2fa secret", userWithSecret.secret);

    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: userWithSecret.secret.key,
    });
  }
}
