import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { Users } from './users';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database';

@Module({
  controllers: [UsersController],
  providers: [Users],
  imports: [
    TypeOrmModule.forFeature([User]),
  ],

})
export class UsersModule {}
