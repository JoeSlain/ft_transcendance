
import { Controller, Get, Post, UseGuards, Redirect, Res, Req } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { FortyTwoAuthGuard } from './auth/42.guard';
import { Response } from 'express';

@Controller('auth')
export class AppController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @UseGuards(FortyTwoAuthGuard)
  login() {
    console.log('login')
    return ;
  }

  @Get('redirect')
  @UseGuards(FortyTwoAuthGuard)
  async redirect(@Req() req, @Res() res) {
    console.log('redirect')
    const token = await this.authService.login(req.user);
    const url = new URL('http://localhost');
    
    url.port = '3000';
    url.pathname = 'login';
    url.searchParams.set('code', token);
    console.log('url', url.href);
    res.redirect(url.href);
  }

  @UseGuards(JwtAuthGuard)
  @Get('login')
  getProfile(@Req() req) {
    return req.user;
  }
}