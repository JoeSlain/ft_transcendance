import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { User } from 'src/database';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TwoFactorGuard } from 'src/auth/2fa/2fa.guard';

@Controller('users')
export class UsersController {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}
   
    @Get(':id')
    @UseGuards(TwoFactorGuard)
    async findOne(@Param() params): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: params.id });

        console.log('get profile', params.id);
        console.log(user);
        return user;
    }
}
