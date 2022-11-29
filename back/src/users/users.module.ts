import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notif, User } from 'src/database';
import { TwoFactorStrategy } from 'src/auth/2fa/2fa.strategy';
import { FortyTwoStrategy } from 'src/auth/42auth/42.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { NotifService } from './notifs.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    NotifService,
  ],
  imports: [
    TypeOrmModule.forFeature([User, Notif]),
    AuthModule,
    JwtModule.register({
      secret: process.env.FT_SECRET,
      signOptions: {
        expiresIn: process.env.COOKIE_EXPIRATION_TIME,
      }
    }),
  ],
  exports: [UsersService, NotifService]
})
export class UsersModule {}
