import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database';
import { TwoFactorStrategy } from 'src/auth/2fa/2fa.strategy';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    TwoFactorStrategy,
  ],
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
})
export class UsersModule {}
