import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        FT_ID: Joi.string().required(),
        FT_SECRET: Joi.string().required(),
        FT_CALLBACK_URL: Joi.string().required(),
      }),
    }),
    UsersModule,
    AuthModule,
    PassportModule.register({session: true}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
