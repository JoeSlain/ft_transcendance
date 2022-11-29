import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database';
import { TwoFactorStrategy } from 'src/auth/2fa/2fa.strategy';
import { FortyTwoStrategy } from 'src/auth/42auth/42.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
  ],
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    JwtModule.register({
      secret: process.env.FT_SECRET,
      signOptions: {
        expiresIn: process.env.COOKIE_EXPIRATION_TIME,
      }
    }),
  ],
  exports: [UsersService]
})
export class UsersModule {}
