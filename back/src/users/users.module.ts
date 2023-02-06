import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game, Notif, Secret, User } from "src/database";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { NotifService } from "./notifs.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService, NotifService],
  imports: [
    TypeOrmModule.forFeature([User, Notif, Game, Secret]),
    AuthModule,
    JwtModule.register({
      secret: process.env.FT_SECRET,
      signOptions: {
        expiresIn: process.env.COOKIE_EXPIRATION_TIME,
      },
    }),
  ],
  exports: [UsersService, NotifService],
})
export class UsersModule {}
