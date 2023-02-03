import {
  Controller,
  UseGuards,
  Get,
  Req,
  Res,
  Post,
  Body,
  UnauthorizedException,
} from "@nestjs/common";
import { FortyTwoAuthGuard, AuthenticatedGuard } from "./42auth/42.guard";
import { TwoFactorAuthenticationService } from "./2fa/2fa.service";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { TwoFactorGuard } from "./2fa/2fa.guard";
import { LocalAuthenticationGuard } from "./local.guard";
import { JwtGuard } from "./2fa/jwt.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Get("login")
  @UseGuards(FortyTwoAuthGuard)
  login() {
    console.log("login");
    return;
  }

  @Post("logout")
  //@UseGuards(TwoFactorGuard)
  logout(@Req() req) {
    const cookie = this.authService.getLogoutCookie();

    console.log("logout");
    req.res.setHeader("Set-Cookie", cookie);
    return;
  }

  @Get("redirect")
  @UseGuards(FortyTwoAuthGuard)
  async redirect(@Req() req, @Res() res) {
    const accessTokenCookie = this.authService.getCookieWithJwtToken(
      req.user.id
    );

    console.log("redirect");
    req.res.setHeader("Set-Cookie", [accessTokenCookie]);
    if (req.user.isTwoFactorAuthenticationEnabled)
      res.redirect(`http://10.11.7.11:3000/login/2fa`);
    else {
      res.redirect("http://10.11.7.11:3000/login/redirect");
      console.log("2fa is off, redirected ");
    }
  }

  // test for devs only
  @UseGuards(LocalAuthenticationGuard)
  @Post("devlog")
  async devLogin(@Req() req, @Body() { username }) {
    /*const user = await this.usersService.getByUsername(username);

        console.log('devlogin')
        console.log('username', username)
        console.log('user in dev log', user)*/
    if (req.user) {
      const accessTokenCookie = this.authService.getCookieWithJwtToken(
        req.user.id
      );
      req.res.setHeader("Set-Cookie", [accessTokenCookie]);
    }
    return req.user;
  }

  @Post("2fa/generate")
  @UseGuards(TwoFactorGuard)
  async register(@Res() res, @Req() req) {
    console.log("2fa");
    console.log("req user", req.user);
    const { otpauthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        req.user
      );

    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      res,
      otpauthUrl
    );
  }

  @Post("2fa/turn-on")
  @UseGuards(TwoFactorGuard)
  async turnOnTwoFactorAuthentication(@Req() req, @Body() { code }) {
    console.log("turn on", code);
    const isCodeValid =
      await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        code,
        req.user
      );

    /*console.log('2fa turn on')
        console.log(isCodeValid)*/

    if (!isCodeValid) {
      return false;
    }
    await this.usersService.turnOnTwoFactorAuthentication(req.user.id);
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      req.user.id,
      true
    );
    req.res.setHeader("Set-Cookie", [accessTokenCookie]);
    console.log("true");
    return true;
  }

  @Post("2fa/turn-off")
  @UseGuards(TwoFactorGuard)
  async turnOffTwoFactorAuthentication(@Req() req) {
    const ret = await this.usersService.turnOffTwoFactorAuthentication(
      req.user.id
    );

    return ret;
  }

  @Post("2fa/authenticate")
  @UseGuards(JwtGuard)
  async authenticate(@Req() req, @Body() { code }) {
    console.log("2fa auth");
    const isCodeValid =
      await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        code,
        req.user
      );

    if (!isCodeValid) return null;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      req.user.id,
      true
    );
    req.res.setHeader("Set-Cookie", [accessTokenCookie]);
    return req.user;
  }
}
