import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { User } from 'src/database';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticatedGuard } from 'src/auth/42.guard';

@Controller('users')
export class UsersController {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}
   
    @Get(':id')
    @UseGuards(AuthenticatedGuard)
    async findOne(@Param() params): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: params.id });

        return user;
    }
}
