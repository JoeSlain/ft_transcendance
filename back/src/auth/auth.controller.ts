import { Controller, UseGuards, Get, Req, Res } from '@nestjs/common';
import { Request } from 'express';
import { FortyTwoAuthGuard, AuthenticatedGuard } from './42.guard';

@Controller('auth')
export class AuthController {
    @Get('login')
    @UseGuards(FortyTwoAuthGuard)
    login() {
        console.log('login')
        return;
    }

    @Get('redirect')
    @UseGuards(FortyTwoAuthGuard)
    async redirect(@Req() req, @Res() res) {
        console.log('redirect')
        /*const token = await this.authService.login(req.user);
        const url = new URL('http://localhost');
        
        url.port = '3000';
        url.pathname = 'login';
        url.searchParams.set('code', token);
        console.log('url', url.href);
        res.redirect(url.href);*/
        res.redirect(`http://localhost:3000/profile/${req.user.id}`);
    }

    @Get('home')
    @UseGuards(AuthenticatedGuard)
    getProfile(@Req() request: Request) {
        console.log();
        return ;
    }
}
