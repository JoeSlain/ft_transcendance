import { Controller, UseGuards, Get, Req, Res, Post, Body, UnauthorizedException, HttpCode } from '@nestjs/common';
import { FortyTwoAuthGuard, AuthenticatedGuard } from './42auth/42.guard';
import { TwoFactorAuthenticationService } from './2fa/2fa.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { TwoFactorGuard } from './2fa/2fa.guard';
import { LocalAuthenticationGuard } from './local.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) { }

    @Get('login')
    @UseGuards(FortyTwoAuthGuard)
    login() {
        console.log('login')
        return;
    }

    @Post('logout')
    @UseGuards(TwoFactorGuard)
    logout(@Req() req) {
        const cookie = this.authService.getLogoutCookie();

        req.res.setHeader('Set-Cookie', cookie);
        return;
    }

    @Get('redirect')
    @UseGuards(FortyTwoAuthGuard)
    async redirect(@Req() req, @Res() res) {
        const accessTokenCookie = this.authService.getCookieWithJwtToken(req.user.id);

        console.log('redirect')
        req.res.setHeader('Set-Cookie', [accessTokenCookie]);
        if (req.user.isTwoFactorAuthenticationEnabled)
            res.redirect(`http://localhost:3000/login/2fa`);
        else
            res.redirect('http://localhost:3000/login/redirect');
    }

    // test for devs only
    @UseGuards(LocalAuthenticationGuard)
    @Post('devlog')
    async devLogin(@Req() req) {
        const user = await this.usersService.getByUsername(req.user.username);

        console.log('devlogin')
        //console.log(user)
        if (user) {
            const accessTokenCookie = this.authService.getCookieWithJwtToken(user.id);
            req.res.setHeader('Set-Cookie', [accessTokenCookie]);
        }
        return user;
    }

    @Post('2fa/generate')
    @UseGuards(AuthenticatedGuard)
    async register(@Res() res, @Req() req) {
        const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(req.user);

        return this.twoFactorAuthenticationService.pipeQrCodeStream(res, otpauthUrl);
    }

    @Post('2fa/turn-on')
    @UseGuards(AuthenticatedGuard)
    async turnOnTwoFactorAuthentication(
        @Req() req,
        @Body() { twoFactorAuthenticationCode }
    ) {
        const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
            twoFactorAuthenticationCode, req.user
        );

        /*console.log('2fa turn on')
        console.log(isCodeValid)*/

        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        await this.usersService.turnOnTwoFactorAuthentication(req.user.id);
        const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(req.user.id, true);
        req.res.setHeader('Set-Cookie', [accessTokenCookie]);
    }

    @Post('2fa/turn-off')
    @UseGuards(TwoFactorGuard)
    async turnOffTwoFactorAuthentication(@Req() req) {
        await this.usersService.turnOffTwoFactorAuthentication(req.user.id);
    }

    @Post('2fa/authenticate')
    @UseGuards(AuthenticatedGuard)
    async authenticate(
        @Req() req,
        @Body() { twoFactorAuthenticationCode }
    ) {
        const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
            twoFactorAuthenticationCode, req.user
        );

        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }

        const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(req.user.id, true);

        req.res.setHeader('Set-Cookie', [accessTokenCookie]);
        return req.user;
    }
}
