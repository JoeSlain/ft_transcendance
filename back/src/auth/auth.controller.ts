import { Controller, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthenticatedGuard } from './42.guard';
import { Request } from 'express';
import { FortyTwoAuthGuard } from './42.guard';

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
        res.redirect('http://localhost:3000/home');
    }

    @Get('home')
    @UseGuards(AuthenticatedGuard)
    getProfile(@Req() request: Request) {
        return 'ok home';
    }
}
