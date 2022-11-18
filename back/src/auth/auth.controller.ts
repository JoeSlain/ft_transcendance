import { Controller, UseGuards, Get, Req, Res, Post, Body, UnauthorizedException } from '@nestjs/common';
import { FortyTwoAuthGuard, AuthenticatedGuard } from './42auth/42.guard';
import { TwoFactorAuthenticationService } from './2fa/2fa.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { TwoFactorGuard } from './2fa/2fa.guard';

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

    @Get('redirect')
    @UseGuards(FortyTwoAuthGuard)
    async redirect(@Req() req, @Res() res) {
        const accessTokenCookie = this.authService.getCookieWithJwtToken(req.user.id);
        console.log('redirect')

        req.res.setHeader('Set-Cookie', [accessTokenCookie]);

        if (req.user.isTwoFactorAuthenticationEnabled)
            res.redirect(`http://localhost:3000/login/2fa`);
        else
            res.redirect(`http://localhost:3000/profile/${req.user.id}`);
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
        
        console.log('2fa turn on')
        console.log(isCodeValid)

        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        await this.usersService.turnOnTwoFactorAuthentication(req.user.id);
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
