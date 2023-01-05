import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from "./database";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "./users/users.module";
import { GameModule } from "./game/game.module";
import { ChatModule } from "./chat/chat.module";
import * as dotenv from "dotenv";

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        FT_ID: Joi.string().required(),
        FT_SECRET: Joi.string().required(),
        FT_CALLBACK_URL: Joi.string().required(),
      }),
    }),
    AuthModule,
    PassportModule.register({ session: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: entities,
      synchronize: true,
    }),
    UsersModule,
    GameModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
