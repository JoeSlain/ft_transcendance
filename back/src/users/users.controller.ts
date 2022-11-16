import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { User } from 'src/database';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticatedGuard } from 'src/auth/42auth/42.guard';

@Controller('users')
export class UsersController {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}
   
    @Get('')
    @UseGuards(AuthenticatedGuard)
    async findMe(@Req() req): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: req.user.id });

        console.log('get profile', req.user.id);
        console.log(user);
        return user;
    }

    @Get(':id')
    @UseGuards(AuthenticatedGuard)
    async findOne(@Param() params): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: params.id });

        console.log('get profile', params.id);
        console.log(user);
        return user;
    }
}
