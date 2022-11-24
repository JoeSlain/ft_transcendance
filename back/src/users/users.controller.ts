import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { User } from 'src/database';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticatedGuard } from 'src/auth/42auth/42.guard';
import { TwoFactorGuard } from 'src/auth/2fa/2fa.guard';
import { UsersService } from './users.service';

class PostDTO {
    content: string;
}

@Controller('users')
export class UsersController {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly usersService: UsersService
    ) {}
   
    @Get('')
    @UseGuards(TwoFactorGuard)
    async findMe(@Req() req): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: req.user.id });

        /*console.log('get profile', req.user.id);
        console.log(user);*/
        return user;
    }

    @Get('userid/:id')
    @UseGuards(TwoFactorGuard)
    async findOneById(@Param() params): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: params.id });

        /*console.log('get profile', params.id);
        console.log(user);*/
        return user;
    }

    @Get('username/:username')
    @UseGuards(TwoFactorGuard)
    async findOneByUsername(@Param() params): Promise<User> {
        const user = await this.userRepository.findOneBy({ username: params.username});

        /*console.log('find by username')
        console.log(user);*/
        return user;
    }

    @Post('friend')
    @UseGuards(TwoFactorGuard)
    async addFriend(@Req() req, @Body() { username } ){
        /*console.log(username);
        console.log('me', req.user.username);*/
        const user = this.usersService.addFriend(req.user, username);

        return (user);
    }

    @Get('friends')
    @UseGuards(TwoFactorGuard)
    async getFriends(@Req() req) {
        //console.log('get friends')
        const users = await this.usersService.getFriends(req.user);

        return (users);
    }

    @Post('deleteFriend')
    @UseGuards(TwoFactorGuard)
    async deleteFriend(@Req() req, @Body() { userId }) {
        //console.log('delete friend')
        const users = await this.usersService.deleteFriend(req.user, userId);

        return users;
    }
}
